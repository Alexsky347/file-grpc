import { LoginProps } from '@/model/interface/login-props';
import http from './http-common';
import { ItToken } from '@/model/interface/it-token';
import { brown } from '@mui/material/colors';

type TokenKeys = keyof ItToken;

export class AuthService {
  private static isLogged: boolean;

  static async login(data: LoginProps) {
    try {
      const response = await http.post('/login', data);
      const { headers } = response;
      this.setUserInfo(headers);
      return response;
    } catch (e) {
      return e;
    }
  }

  static setUserInfo(data: ItToken) {
    const expirationDate = new Date();
    const days = 1;
    expirationDate.setDate(expirationDate.getDate() + days);
    Object.entries(data).forEach(([key, value]) => {
      const cookieValue = encodeURIComponent(value as string);
      const cookieOptions = [
        `expires=${expirationDate.toUTCString()}`,
        `path=/`,
        `max-age=86400`, // Maximum age in seconds (optional)
        `secure`, // Send the cookie over HTTPS only (optional)
        `samesite=strict`, // Only send the cookie with same-site requests (optional)
      ];
      document.cookie = `${key}=${cookieValue}; ${cookieOptions.join('; ')}`;
    });
  }

  static removeUserInfo() {
    document.cookie = 'access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
  }

  static setLoginUser(state: boolean) {
    this.isLogged = state;
  }

  static getBearer(): string | undefined {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
    if (cookieValue) {
      return 'Bearer ' + cookieValue;
    }
    return undefined;
  }

  /**
   * check if bearer and redirect in this case
   */
  static checkLoginAndRedirect = (navigate: any) => {
    const getBearer = AuthService.getBearer();
    if (getBearer) {
      navigate('/', { replace: true });
    }
  };
}
