import http from './http-common';
import { LoginProps } from '../../model/interface/login-props';
import { Constants } from '../../utils/main/constants';

export class AuthService {
  private static readonly URI = '/auth';
  private static readonly USER_KEY = Constants.localStorage.USER_KEY;

  static login = async (payload: LoginProps) => {
    const { data } = await http.post(`${this.URI}/signin`, payload);
    if (data?.username) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(data));
      return data;
    }
  };

  static logout = async () => {
    const { data } = await http.post(`${this.URI}/signout`);
    localStorage.removeItem(this.USER_KEY);
    return data;
  };

  static getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(this.USER_KEY) as string);
  };
}
