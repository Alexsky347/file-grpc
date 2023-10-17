import { User } from "./user";

export interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    isLoading?: boolean;
  }