import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from '../lib/supabase';

class AppStore {
  isLoadingSignIn = false;
  session: any;
  isSmall = false;
  selectedWorkflowId: string | null = null;
  workflowNavbarOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsSmall(isSmall: boolean) {
    this.isSmall = isSmall;
  }

  setIsLoadingSignIn(isLoading: boolean) {
    this.isLoadingSignIn = isLoading;
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

  get sessionAccessToken() {
    return this.session?.access_token || null;
  }
}

const appStore = new AppStore();
export default appStore;
