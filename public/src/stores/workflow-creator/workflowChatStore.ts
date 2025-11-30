import { makeAutoObservable } from 'mobx';
import { WorkflowMessage } from '@shared/types/workflowChat';
import { WORKFLOW_MESSAGE_ROLE } from '@shared/consts/workflows';

class WorkflowChatStore {
  messages: WorkflowMessage[] = [];
  inputValue: string = '';
  isWaitingForResponse: boolean = false;
  isWaitingForFileApproval: boolean = false;
  loaderText: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  // Computed properties
  get isInputDisabled(): boolean {
    return this.isWaitingForResponse || this.isWaitingForFileApproval;
  }

  get shouldShowLoader(): boolean {
    return this.isWaitingForResponse && this.loaderText.length > 0;
  }

  get inputPlaceholder(): string {
    if (this.isWaitingForResponse) return 'Waiting for response...';
    if (this.isWaitingForFileApproval) return 'Waiting for file approval...';
    return "Explain the gruntwork you'd like to eliminate";
  }

  // Actions
  setInputValue(value: string) {
    this.inputValue = value;
  }

  setIsWaitingForResponse(waiting: boolean) {
    this.isWaitingForResponse = waiting;
  }

  setIsWaitingForFileApproval(waiting: boolean) {
    this.isWaitingForFileApproval = waiting;
  }

  setLoaderText(text: string) {
    this.loaderText = text;
  }

  addMessage(message: WorkflowMessage) {
    this.messages.push(message);
  }

  addUserMessage(content: string) {
    const message: WorkflowMessage = {
      id: crypto.randomUUID(),
      role: WORKFLOW_MESSAGE_ROLE.USER,
      content,
      timestamp: new Date(),
    };
    this.messages.push(message);
  }

  addAssistantMessage(content: string) {
    const message: WorkflowMessage = {
      id: crypto.randomUUID(),
      role: WORKFLOW_MESSAGE_ROLE.ASSISTANT,
      content,
      timestamp: new Date(),
    };
    this.messages.push(message);
  }

  clearMessages() {
    this.messages = [];
  }
}

const workflowChatStore = new WorkflowChatStore();
export default workflowChatStore;
