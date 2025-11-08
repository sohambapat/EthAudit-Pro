
import React, { useState, useCallback } from 'react';
import type { Vulnerability, AuditState } from './types';
import { analyzeContract } from './services/geminiService';
import { EXAMPLE_CONTRACTS } from './constants';
import AgentStatus from './components/AgentStatus';
import ContractInput from './components/ContractInput';
import AuditReport from './components/AuditReport';
import PatchedCode from './components/PatchedCode';

const App: React.FC = () => {
  const [auditState, setAuditState] = useState<AuditState>('idle');
  const [contractCode, setContractCode] = useState<string>('');
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedChanges, setSelectedChanges] = useState<Set<number>>(new Set());
  const [patchedCode, setPatchedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAudit = useCallback(async (source: string) => {
    setError(null);
    setVulnerabilities([]);
    setSelectedChanges(new Set());
    setPatchedCode('');
    setAuditState('fetching');

    // Simulate Agent 1: Fetching code
    await new Promise(res => setTimeout(res, 1000));
    const code = EXAMPLE_CONTRACTS[source] || source;
    setContractCode(code);
    
    setAuditState('analyzing');
    try {
      // Simulate Agent 2 & 3: Analyzing and reporting
      const results = await analyzeContract(code);
      setVulnerabilities(results);
      setAuditState('reporting');
    } catch (e) {
      console.error(e);
      setError('Failed to analyze the contract. Please check the console for more details.');
      setAuditState('error');
    }
  }, []);

  const handleApplyPatches = useCallback(() => {
    if (selectedChanges.size === 0) {
      setPatchedCode(contractCode);
      setAuditState('done');
      return;
    }

    const changesToApply = vulnerabilities
      .filter(v => selectedChanges.has(v.id))
      .sort((a, b) => b.lineStart - a.lineStart); // Apply changes from bottom to top

    let codeLines = contractCode.split('\n');

    for (const change of changesToApply) {
      const { lineStart, lineEnd, suggestedCode } = change;
      const suggestedLines = suggestedCode.split('\n');
      // line numbers are 1-based, array is 0-based
      codeLines.splice(lineStart - 1, lineEnd - lineStart + 1, ...suggestedLines);
    }

    setPatchedCode(codeLines.join('\n'));
    setAuditState('done');
  }, [contractCode, vulnerabilities, selectedChanges]);

  const handleReset = () => {
    setAuditState('idle');
    setContractCode('');
    setVulnerabilities([]);
    setSelectedChanges(new Set());
    setPatchedCode('');
    setError(null);
  };

  const isAuditing = auditState === 'fetching' || auditState === 'analyzing';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Smart Contract Auditor</h1>
          <p className="text-lg text-teal-400">Powered by a Multi-Agent System & Gemini</p>
        </header>

        <main className="bg-gray-800 rounded-xl shadow-2xl p-6">
          <AgentStatus state={auditState} />
          
          {error && (
            <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-md my-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {auditState === 'idle' && (
            <ContractInput onAudit={handleAudit} disabled={isAuditing} />
          )}

          {(auditState === 'reporting') && (
            <AuditReport 
              vulnerabilities={vulnerabilities}
              selectedChanges={selectedChanges}
              setSelectedChanges={setSelectedChanges}
              onApplyPatches={handleApplyPatches}
            />
          )}

          {auditState === 'done' && (
            <PatchedCode code={patchedCode} onReset={handleReset} />
          )}
        </main>
        <footer className="text-center mt-8 text-gray-600">
          <p>This application simulates a multi-agent workflow. Smart contract audits should always be performed by qualified professionals.</p>
          <p>&copy; {new Date().getFullYear()} AI Systems Inc.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
