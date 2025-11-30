import { WorkflowMessageRole } from '../consts/workflows';

export interface WorkflowMessage {
  id: string;
  role: WorkflowMessageRole;
  content: string;
  timestamp: Date;
}
