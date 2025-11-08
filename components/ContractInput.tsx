import React, { useState, useCallback, useRef } from 'react';
import { ArrowUpTrayIcon } from './Icons';

interface ContractInputProps {
  onAudit: (source: string) => void;
  disabled: boolean;
}

const ContractInput: React.FC<ContractInputProps> = ({ onAudit, disabled }) => {
  const [source, setSource] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;

    if (file && file.name.endsWith('.sol')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          setSource(text);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid Solidity (.sol) file.");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] || null);
  }, [handleFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] || null);
  };

  const onUploadAreaClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="animate-fade-in">
      <p className="text-center text-gray-400 mb-6">
        Choose a pre-loaded example, paste your Solidity code, or upload a <code>.sol</code> file.
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
            placeholder="Paste Solidity code here..."
            className="w-full h-48 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-none font-mono text-sm"
            disabled={disabled}
          />
        </div>

        <div 
          className={`mt-4 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center ${isDragging ? 'border-teal-400 bg-gray-700' : 'border-gray-600 hover:border-gray-500'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={onUploadAreaClick}
          role="button"
          aria-label="File upload zone"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".sol,application/solidity"
            className="hidden"
          />
          <ArrowUpTrayIcon />
          <p className="text-gray-400">
            Drag & drop a <code>.sol</code> file here, or <span className="text-teal-400 font-semibold">click to upload</span>.
          </p>
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