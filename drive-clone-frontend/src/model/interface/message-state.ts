import { ToastLevel } from '../type/level';

export interface MessageState {
  message: string;
  level?: ToastLevel;
}
