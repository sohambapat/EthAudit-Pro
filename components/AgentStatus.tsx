
import React from 'react';
import type { AuditState } from '../types';
import { CheckCircleIcon, CubeTransparentIcon, DocumentMagnifyingGlassIcon, ShieldCheckIcon, SparklesIcon, XCircleIcon } from './Icons';
import Spinner from './Spinner';

interface StatusStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

const StatusStep: React.FC<StatusStepProps> = ({ icon, title, description, isActive, isCompleted }) => {
  const statusColor = isCompleted ? 'text-teal-400' : isActive ? 'text-yellow-400' : 'text-gray-500';
  const descriptionColor = isActive || isCompleted ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className="relative flex items-start">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
        <div className={statusColor}>
          {isActive ? <Spinner /> : icon}
        </div>
      </div>
      <div className="ml-4">
        <h3 className={`text-lg font-semibold ${statusColor}`}>{title}</h3>
        <p className={`text-sm ${descriptionColor}`}>{description}</p>
      </div>
    </div>
  );
};

interface AgentStatusProps {
  state: AuditState;
}

const AgentStatus: React.FC<AgentStatusProps> = ({ state }) => {
  const steps = [
    { id: 'fetching', icon: <CubeTransparentIcon />, title: 'Agent 1: Fetch Code', description: 'Fetching contract from source...' },
    { id: 'analyzing', icon: <DocumentMagnifyingGlassIcon />, title: 'Agent 2 & 3: Analyze & Report', description: 'Detecting vulnerabilities with Gemini...' },
    { id: 'reporting', icon: <ShieldCheckIcon />, title: 'Agent 4: Patch Contract', description: 'Review suggestions and apply fixes.' },
    { id: 'done', icon: <SparklesIcon />, title: 'Audit Complete', description: 'Patched contract generated successfully.' },
  ];

  const currentStateIndex = steps.findIndex(step => step.id === state) 
    + (state === 'done' || state === 'error' ? 1 : 0);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StatusStep 
              icon={state === 'error' && index >= currentStateIndex - 1 ? <XCircleIcon /> : (index < currentStateIndex ? <CheckCircleIcon /> : step.icon)}
              title={step.title}
              description={step.description}
              isActive={state === step.id && state !== 'done'}
              isCompleted={index < currentStateIndex || state === 'done'}
            />
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center">
                <div className="h-0.5 w-16 bg-gray-600" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AgentStatus;
