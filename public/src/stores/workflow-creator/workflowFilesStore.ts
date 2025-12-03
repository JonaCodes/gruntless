import { makeAutoObservable } from 'mobx';
import { FileWithPath } from '@mantine/dropzone';
import { FileExtract, ExtractionStatus } from '@shared/types/workflows';

class WorkflowFilesStore {
  uploadedFiles: FileWithPath[] = [];
  extractedFiles: Record<string, FileExtract> = {};
  extractionStatus: Record<string, ExtractionStatus> = {};
  extractionErrors: Record<string, string> = {};
  approvedFiles: Set<string> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  // Computed properties
  get hasFiles(): boolean {
    return this.uploadedFiles.length > 0;
  }

  get fileNames(): string[] {
    return this.uploadedFiles.map((file) => file.name);
  }

  get allFilesApproved(): boolean {
    return (
      this.hasFiles &&
      this.uploadedFiles.every((file) => this.approvedFiles.has(file.name))
    );
  }

  get approvedFileCount(): number {
    return this.approvedFiles.size;
  }

  get hasMultipleFiles(): boolean {
    return this.uploadedFiles.length > 1;
  }

  // Actions
  addFiles(files: FileWithPath[]) {
    files.forEach((file) => {
      if (!this.uploadedFiles.some((f) => f.name === file.name)) {
        this.uploadedFiles.push(file);
      }
    });
  }

  removeFile(fileName: string) {
    this.uploadedFiles = this.uploadedFiles.filter(
      (file) => file.name !== fileName
    );
    delete this.extractedFiles[fileName];
    delete this.extractionStatus[fileName];
    delete this.extractionErrors[fileName];
    this.approvedFiles.delete(fileName);
  }

  clearAllFiles() {
    this.uploadedFiles = [];
    this.extractedFiles = {};
    this.extractionStatus = {};
    this.extractionErrors = {};
    this.approvedFiles.clear();
  }

  setExtractedFiles(data: Record<string, FileExtract>) {
    this.extractedFiles = data;
  }

  setExtractionStatus(fileName: string, status: ExtractionStatus) {
    this.extractionStatus[fileName] = status;
  }

  setExtractionError(fileName: string, error: string) {
    this.extractionErrors[fileName] = error;
  }

  getExtractionStatus(fileName: string): ExtractionStatus | undefined {
    return this.extractionStatus[fileName];
  }

  approveFile(fileName: string) {
    this.approvedFiles.add(fileName);
  }

  approveAllFiles() {
    this.uploadedFiles.forEach((file) => {
      this.approvedFiles.add(file.name);
    });
  }

  unapproveFile(fileName: string) {
    this.approvedFiles.delete(fileName);
  }
}

const workflowFilesStore = new WorkflowFilesStore();
export default workflowFilesStore;
