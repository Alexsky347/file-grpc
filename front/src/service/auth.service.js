import axios from "axios";

export class AuthService {

    static isLogged = false;
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

    static logout() {
        localStorage.removeItem("user");
    }

    static setLoginUser(state) {
        this.isLogged = state;
    }

    static setJWTHeader() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user.accessToken) {
            return { Authorization: 'Bearer ' + user.accessToken };
        } else {
            return {};
        }
    }


}

