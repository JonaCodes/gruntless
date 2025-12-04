import { makeAutoObservable } from 'mobx';
import { WorkflowMessage } from '@shared/types/workflowChat';
import { WORKFLOW_MESSAGE_ROLE } from '@shared/consts/workflows';
import workflowFilesStore from './workflowFilesStore';

class WorkflowChatStore {
  messages: WorkflowMessage[] = [];
  inputValue: string = '';
  isWaitingForResponse: boolean = false;
  isWaitingForFileApproval: boolean = false;
  loaderText: string = '';
  private inputFocusCallback: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Computed properties
  get isInputDisabled(): boolean {
    return (
      this.isWaitingForResponse ||
      this.isWaitingForFileApproval ||
      !workflowFilesStore.allFilesApproved
    );
  }

  get shouldShowLoader(): boolean {
    return this.isWaitingForResponse && this.loaderText.length > 0;
  }

  get inputPlaceholder(): string {
    if (this.isWaitingForResponse) return 'Waiting for response...';
    if (this.isWaitingForFileApproval) return 'Waiting for file approval...';

    // Step-based placeholder logic
    if (!workflowFilesStore.hasFiles) {
      return 'Please upload at least one file to start';
    }

    if (!workflowFilesStore.allFilesApproved) {
      return 'Please approve your file(s)';
    }

    return "Explain the gruntwork you'd like to eliminate";
  }

  get shouldShowTemplateSuggestions(): boolean {
    return (
      workflowFilesStore.allFilesApproved &&
      this.messages.length === 0 &&
      !this.isWaitingForResponse &&
      !this.isWaitingForFileApproval
    );
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

  addAssistantMessage(content: string, linkTo?: string) {
    const message: WorkflowMessage = {
      id: crypto.randomUUID(),
      role: WORKFLOW_MESSAGE_ROLE.ASSISTANT,
      content,
      timestamp: new Date(),
      ...(linkTo && { linkTo }),
    };
    this.messages.push(message);
  }

  clearMessages() {
    this.messages = [];
  }

  registerInputFocus(callback: () => void) {
    this.inputFocusCallback = callback;
  }

  focusInput() {
    if (this.inputFocusCallback) {
      this.inputFocusCallback();
    }
  }
}

const workflowChatStore = new WorkflowChatStore();
export default workflowChatStore;
