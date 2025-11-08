
import React, { useState, useCallback } from 'react';
import { ClipboardIcon, ClipboardCheckIcon, ArrowPathIcon } from './Icons';

interface PatchedCodeProps {
  code: string;
  onReset: () => void;
}

const PatchedCode: React.FC<PatchedCodeProps> = ({ code, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-4">Patched Contract</h2>
      <p className="text-center text-gray-400 mb-6">The selected fixes have been applied. Review the new contract code below.</p>
      
      <div className="relative bg-gray-900 rounded-lg border border-gray-700">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <ClipboardCheckIcon className="text-green-400" /> : <ClipboardIcon />}
        </button>
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="language-solidity text-gray-300">{code}</code>
        </pre>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onReset}
          className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-200 flex items-center text-lg"
        >
          <ArrowPathIcon />
          <span className="ml-2">Start New Audit</span>
        </button>
      </div>
    </div>
  );
};

export default PatchedCode;
