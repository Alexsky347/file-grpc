import http from "./http-common.js";

export class AuthService {

    static async postLogin(data) {
        return http
            .post('/login', data)
            .then(response => {
                return response;
            })
            .catch((e) => {
                return e;
            });
    };

    static setUserInfo(userInfo) {
        localStorage.setItem("user", JSON.stringify(userInfo));
    }

    static removeUserInfo() {
        localStorage.removeItem("user");
    }

    static setLoginUser(state) {
        this.isLogged = state;
    }

    static getBearer() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            return 'Bearer ' + user.accessToken;
        } else {
            return {};
        }
    }


}

