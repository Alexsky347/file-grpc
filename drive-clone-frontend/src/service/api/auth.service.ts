
import http from './http-common';
import { ItToken } from "../../model/interface/it-token";
import { LoginProps } from "../../model/interface/login-props";
import { Constants } from "../../utils/main/constants";



type TokenKeys = keyof ItToken;

export class AuthService {
  private static readonly URI = '/auth';
  private static readonly USER_KEY = Constants.localStorage.USER_KEY;

  static login = async (payload: LoginProps) => {
      const response = await http.post(`${this.URI}/signin`, payload);
      if (response?.data?.username) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        return response.data;
      }
  };

  static logout = async () => {
    localStorage.removeItem('user');
    const response = await http.post(`${this.URI}/signout`);
    return response.data;
  };

  static getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(this.USER_KEY) as string);
  };

}
