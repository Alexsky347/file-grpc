
import http from './http-common';
import { ItToken } from "../../model/interface/it-token";
import { LoginProps } from "../../model/interface/login-props";



type TokenKeys = keyof ItToken;

export class AuthService {
  private static URI = '/auth';

  static login = async (payload: LoginProps) => {
    try {
      console.log(payload)
      const response = await http.post(`/auth/signin`, payload);
      console.log('success login', response);
      if (response.data.username) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (e) {
      console.log('error login', e);
      return e;
    }
  };

  static logout = async () => {
    localStorage.removeItem('user');
    const response = await http.post(`${this.URI}/signout`);
    return response.data;
  };

  static getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user') as string);
  };

}
