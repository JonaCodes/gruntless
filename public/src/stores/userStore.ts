import { makeAutoObservable } from 'mobx';

class UserStore {
  isLoadingUser = true;
  user: {
    id: number;
    full_name?: string;
    avatar_url?: string;
  } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoadingUser(isLoadingUser: boolean) {
    this.isLoadingUser = isLoadingUser;
  }

  setUser(user: any) {
    this.user = user;
  }

  clearUser() {
    this.user = null;
  }
}

const userStore = new UserStore();
export default userStore;
