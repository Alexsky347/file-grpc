import http from "./http-common.js";
import { AuthService } from "./auth.service";

export class FileService {
  config = {
    headers: {
      Authorization: AuthService.getBearer(),
      "Content-Type": "multipart/form-data",
    },
  };

  async getFiles(limit, pageNumber, orderBy) {
    return http
      .get(`/files?limit=${limit}&pageNumber=${pageNumber}&orderBy=${orderBy}`, this.config)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }

  async getFile(fileName) {
    this.config.responseType = "blob";
    return http.get(`/file/${fileName}`, this.config);
  }

  async uploadOneFile(fileFormData) {
    return http
      .post(`/file/`, fileFormData, this.config)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }

  async uploadMultipleFiles(fileFormData) {
    return http
      .post(`/files/`, fileFormData, this.config)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }

  async deleteFile(filename) {
    return http
      .delete(`/file/${filename}`, this.config)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }

  async renameFile(oldName, newName) {
    return http
      .patch(`/file/${oldName}/${newName}`, {}, this.config)
      .then((response) => {
        return response;
      })
      .catch((e) => {
        return e;
      });
  }
}
