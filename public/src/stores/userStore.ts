import { makeAutoObservable } from 'mobx';

class UserStore {
  isLoadingUser = false;
  user: {
    id: number;
    fullName?: string;
    avatarUrl?: string;
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
