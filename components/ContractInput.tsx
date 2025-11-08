
import React, { useState } from 'react';
import { GithubIcon } from './Icons';

interface ContractInputProps {
  onAudit: (source: string) => void;
  disabled: boolean;
}

const ContractInput: React.FC<ContractInputProps> = ({ onAudit, disabled }) => {
  const [source, setSource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source.trim()) {
      onAudit(source.trim());
    }
  };

  const selectExample = (example: string) => {
    setSource(example);
    onAudit(example);
  };

  return (
    <div className="animate-fade-in">
      <p className="text-center text-gray-400 mb-6">
        Enter a smart contract source (Etherscan, GitHub URL) or paste the code directly. For this demo, you can also select a pre-loaded example.
      </p>
      
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => selectExample('reentrancy')} className="px-4 py-2 bg-gray-700 hover:bg-teal-500 rounded-lg transition-colors duration-200">Reentrancy Example</button>
        <button onClick={() => selectExample('overflow')} className="px-4 py-2 bg-gray-700 hover:bg-teal-500 rounded-lg transition-colors duration-200">Integer Overflow Example</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste Solidity code here or enter a URL..."
            className="w-full h-48 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-none font-mono text-sm"
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !source.trim()}
          className="w-full mt-4 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center text-lg"
        >
          {disabled ? 'Auditing...' : 'Start Audit'}
        </button>
      </form>
    </div>
  );
};

export default ContractInput;
