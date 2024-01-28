import { User } from './user'

export interface AuthState {
  isLoggedIn: boolean
  user: User | undefined
  isLoading?: boolean
}
