
export interface Vulnerability {
  id: number;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  lineStart: number;
  lineEnd: number;
  originalCode: string;
  suggestedCode: string;
}

export type AuditState = 'idle' | 'fetching' | 'analyzing' | 'reporting' | 'done' | 'error';