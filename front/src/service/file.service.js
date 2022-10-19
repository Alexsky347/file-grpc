import axios from "axios";
import { AuthService } from "./auth.service";

export class FileService {

    #BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api';

    async getFiles() {
        return axios
            .get(`${this.#BACKEND_URL}/files`, AuthService.getHeaderJWT())
            .then(response => {
                return response;
            })
            .catch((e) => {
                return e
            });
    };

    async getOneFile(fileName) {
        return await fetch(`${this.#BACKEND_URL}/file/${fileName}`, AuthService.getHeaderJWT(), {
            mode: "no-cors", // 'cors' by default
        });
    };

    async postOneFile(fileFormData) {
        return axios
            .post(`${this.#BACKEND_URL}/file/`, fileFormData)
            .then(response => {
                return response;
            })
            .catch((e) => {
                return e
            });
    };


}