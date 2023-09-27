import http from './http-common';
import { AxiosRequestConfig } from 'axios';

export class FileService {
  private static readonly config: AxiosRequestConfig<unknown> = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  private static readonly URI = '/file';

  static getFiles = async(limit: number, pageNumber: number, orderBy: string) => {
    try {
      return await http.get(
          `/files?limit=${limit}&pageNumber=${pageNumber}&orderBy=${orderBy}`,
          this.config,
      );
    } catch (e) {
      return e;
    }
  }

  static getFile = async (fileName: string) => {
    this.config.responseType = 'blob';
    return http.get(`${this.URI}/${fileName}`, this.config);
  }


  static uploadOneFile = async (fileFormData: FormData) => {
    try {
      return await http.post(`${this.URI}/`, fileFormData, this.config);
    } catch (e) {
      return e;
    }
  }

  static uploadMultipleFiles = async (fileFormData: FormData) => {
    try {
      return await http.post('/files/', fileFormData, this.config);
    } catch (e) {
      return e;
    }
  }

  static deleteFile = async (filename: string) => {
    try {
      return await http.delete(`${this.URI}/${filename}`);
    } catch (e) {
      return e;
    }
  }

  static renameFile = async (oldName: string, newName: string): Promise<any> => {
    try {
      return await http.patch(
          `/file/${oldName}/${newName}`,
          {},
          this.config,
      );
    } catch (e) {
      return e;
    }
  }
}
