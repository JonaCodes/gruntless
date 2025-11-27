import { makeAutoObservable } from 'mobx';
import { supabase } from '../lib/supabase';

class AppStore {
  isLoadingSignIn = false;
  session: any;
  isSmall = false;

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

  get sessionAccessToken() {
    return this.session?.access_token || null;
  }
}

const appStore = new AppStore();
export default appStore;
