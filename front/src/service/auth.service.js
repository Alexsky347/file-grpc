import axios from "axios";

export class AuthService {

    static #BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api';

    static async postLogin(data) {
        return axios
            .post(`${this.#BACKEND_URL}/login`, data)
            .then(response => {
                return response;
            })
            .catch((e) => { return e; })
            ;
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

    static getHeaderJWT() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            return { headers: { Authorization: 'Bearer ' + user.accessToken } };
        } else {
            return {};
        }
    }


}

