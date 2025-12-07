import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from '../lib/supabase';
import { Workflow } from '@shared/types/workflows';
import { fetchWorkflows } from '../clients/workflows-client';

class AppStore {
  isLoadingSignIn = false;
  session: any;
  isSmall = false;
  selectedWorkflowId: string | null = null;
  workflowNavbarOpened = false;
  workflows: Workflow[] = [];
  isLoadingWorkflows = false;
  workflowsError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsSmall(isSmall: boolean) {
    this.isSmall = isSmall;
  }

  setIsLoadingSignIn(isLoading: boolean) {
    this.isLoadingSignIn = isLoading;
  }

  setIsLoadingWorkflows(isLoading: boolean) {
    this.isLoadingWorkflows = isLoading;
  }

  async loadSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error);
      // TODO: alert & log error
    }

    this.session = data.session;
  }

  openWorkflowNavbar(workflowId: string) {
    this.selectedWorkflowId = workflowId;
    this.workflowNavbarOpened = true;
  }

  closeWorkflowNavbar() {
    this.workflowNavbarOpened = false;
    // Delay clearing selectedWorkflowId for smooth close animation
    setTimeout(() => {
      runInAction(() => {
        this.selectedWorkflowId = null;
      });
    }, 200);
  }

  async loadWorkflows() {
    this.setIsLoadingWorkflows(true);
    this.workflowsError = null;

    try {
      const data = await fetchWorkflows();
      runInAction(() => {
        this.workflows = data;
      });
    } catch (err: any) {
      console.error('Failed to load workflows:', err);
      runInAction(() => {
        this.workflowsError = err.message || 'Failed to load workflows';
      });
    } finally {
      this.setIsLoadingWorkflows(false);
    }
  }

  get sessionAccessToken() {
    return this.session?.access_token || null;
  }
}

const appStore = new AppStore();
export default appStore;
