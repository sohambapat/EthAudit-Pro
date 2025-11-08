
import React from 'react';
import type { Vulnerability } from '../types';
import { ShieldExclamationIcon, CheckIcon, ClipboardIcon } from './Icons';

interface DiffViewerProps {
  originalCode: string;
  suggestedCode: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ originalCode, suggestedCode }) => {
  return (
    <div className="font-mono text-xs bg-gray-900 rounded-md p-3 mt-2 overflow-x-auto">
      <pre className="text-red-400">
        <code>- {originalCode.replace(/\n/g, '\n- ')}</code>
      </pre>
      <pre className="text-green-400 mt-2">
        <code>+ {suggestedCode.replace(/\n/g, '\n+ ')}</code>
      </pre>
    </div>
  );
};

const severityStyles: { [key: string]: string } = {
  Critical: 'bg-red-600 text-red-100',
  High: 'bg-orange-500 text-orange-100',
  Medium: 'bg-yellow-500 text-yellow-100',
  Low: 'bg-blue-500 text-blue-100',
};

interface VulnerabilityCardProps {
  vulnerability: Vulnerability;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

const VulnerabilityCard: React.FC<VulnerabilityCardProps> = ({ vulnerability, isSelected, onToggle }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 transition-all duration-300 border-2 border-transparent hover:border-teal-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-yellow-400 flex items-center">
            <ShieldExclamationIcon /> <span className="ml-2">{vulnerability.type}</span>
            <span className={`ml-3 text-xs font-bold px-2 py-1 rounded-full ${severityStyles[vulnerability.severity] || 'bg-gray-500'}`}>
              {vulnerability.severity}
            </span>
          </h3>
          <p className="text-sm text-gray-400 mt-1">Lines: {vulnerability.lineStart}-{vulnerability.lineEnd}</p>
        </div>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => onToggle(vulnerability.id)} />
            <div className={`w-12 h-6 rounded-full shadow-inner transition-colors duration-200 ${isSelected ? 'bg-teal-500' : 'bg-gray-600'}`}></div>
            <div className={`absolute w-4 h-4 bg-white rounded-full shadow top-1/2 -translate-y-1/2 transition-transform duration-200 ${isSelected ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </div>
          <span className="ml-3 text-gray-200 select-none">Apply Fix</span>
        </label>
      </div>
      <p className="mt-3 text-gray-300">{vulnerability.description}</p>
      <DiffViewer originalCode={vulnerability.originalCode} suggestedCode={vulnerability.suggestedCode} />
    </div>
  );
};


interface AuditReportProps {
  vulnerabilities: Vulnerability[];
  selectedChanges: Set<number>;
  setSelectedChanges: React.Dispatch<React.SetStateAction<Set<number>>>;
  onApplyPatches: () => void;
}

const AuditReport: React.FC<AuditReportProps> = ({ vulnerabilities, selectedChanges, setSelectedChanges, onApplyPatches }) => {
  
  const handleToggle = (id: number) => {
    setSelectedChanges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (vulnerabilities.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-green-400 w-16 h-16 mx-auto mb-4"><CheckIcon/></div>
        <h2 className="text-2xl font-bold text-white">No Vulnerabilities Found!</h2>
        <p className="text-gray-400 mt-2">The AI agent did not find any common vulnerabilities in this contract.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6">Audit Report</h2>
      <div className="space-y-4">
        {vulnerabilities.map(v => (
          <VulnerabilityCard 
            key={v.id} 
            vulnerability={v}
            isSelected={selectedChanges.has(v.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={onApplyPatches}
          className="bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-400 transition-colors duration-200 flex items-center text-lg"
        >
          Apply ({selectedChanges.size}) Selected Patches
        </button>
      </div>
    </div>
  );
};

export default AuditReport;