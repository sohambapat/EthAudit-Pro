
import { GoogleGenAI, Type } from "@google/genai";
import type { Vulnerability } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        type: { type: Type.STRING },
        severity: { type: Type.STRING },
        description: { type: Type.STRING },
        lineStart: { type: Type.INTEGER },
        lineEnd: { type: Type.INTEGER },
        originalCode: { type: Type.STRING },
        suggestedCode: { type: Type.STRING },
      },
      required: ['id', 'type', 'severity', 'description', 'lineStart', 'lineEnd', 'originalCode', 'suggestedCode'],
    },
};

export const analyzeContract = async (contractCode: string): Promise<Vulnerability[]> => {
  const prompt = `
    Your task is to analyze the provided Solidity code for vulnerabilities and suggest precise, minimal fixes.

    **Analysis Instructions:**
    1.  Thoroughly audit the contract for common vulnerabilities including, but not limited to: Reentrancy, Integer Overflow/Underflow, Unchecked External Calls, Denial of Service (DoS), Gas Limit Issues, Incorrect Visibility Modifiers, and Timestamp Dependence.
    2.  For each vulnerability found, you MUST create a JSON object.
    3.  If no vulnerabilities are found, you MUST return an empty JSON array: [].

    **JSON Object Schema:**
    For each vulnerability, the JSON object MUST conform to this schema:
    - **id**: A unique integer for the vulnerability, starting from 1.
    - **type**: A short, descriptive name for the vulnerability (e.g., "Reentrancy", "Integer Overflow").
    - **severity**: The severity level. Must be one of: "Critical", "High", "Medium", "Low".
    - **description**: A clear explanation of the vulnerability, its potential impact, and how the suggested fix resolves it.
    - **lineStart**: The starting line number of the vulnerable code.
    - **lineEnd**: The ending line number of the vulnerable code.
    - **originalCode**: The exact, unmodified block of vulnerable code.
    - **suggestedCode**: The corrected version of the code block. This MUST be a minimal, drop-in replacement. **DO NOT** add new functions, state variables, or invent new logic. The fix must be targeted and precise.

    Here is the contract code:
    \`\`\`solidity
    ${contractCode}
    \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: 'You are a world-class security expert specializing in Solidity smart contract auditing. Your sole purpose is to identify vulnerabilities and provide minimal, correct code patches. You must adhere strictly to the requested JSON output format.',
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as Vulnerability[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid analysis from the AI model.");
    }
};