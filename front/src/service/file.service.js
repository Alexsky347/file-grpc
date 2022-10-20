import http from "./http-common.js";
import { AuthService } from "./auth.service";

export class FileService {


    config = {
        headers: {
            "Authorization": AuthService.getBearer(),
            "Content-Type": "multipart/form-data",
        },
        responseType: 'blob'
    }


    async getFiles() {
        return http
            .get('/files', this.config)
            .then(response => {
                return response;
            })
            .catch((e) => {
                return e
            });
    };

    async getFile(fileName) {
        return http
            .get(`/file/${fileName}`, this.config);
    };

    async uploadOneFile(fileFormData) {
        return http
            .post(`/file/`, fileFormData, this.config)
            .then(response => {
                return response;
            })
            .catch((e) => {
                return e
            });
    };

    async deleteFile(filename) {
        return http
            .delete(`/file/${filename}`, this.config)
            .then(response => {
                return response;
            })
            .catch((e) => {
                return e
            });
    };

    async renameFile(filename) {
        return http
            .put(`/file/${filename}`, this.config)
            .then(response => {
                return response;
            })
            .catch((e) => {
                return e
            });
    };


}