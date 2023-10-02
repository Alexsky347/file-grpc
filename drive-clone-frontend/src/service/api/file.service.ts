import http from './http-common';
import { AxiosRequestConfig } from 'axios';

export class FileService {
  private static readonly config: AxiosRequestConfig<unknown> = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'json',
  };

  private static readonly URI = '/file';

  static getFiles = async (
    limit: number,
    pageNumber: number,
    orderBy: string
  ) => {
    return await http.get(
      `/files?limit=${limit}&pageNumber=${pageNumber}&orderBy=${orderBy}`,
      this.config
    );
  };

  static getFile = async (fileName: string) => {
    this.config.responseType = 'blob';
    const { headers, data } = await http.get(
      `${this.URI}/${fileName}`,
      this.config
    );
    return { headers, data };
  };

  static uploadOneFile = async (fileFormData: FormData) => {
    return await http.post(`${this.URI}/`, fileFormData, this.config);
  };

  static uploadMultipleFiles = async (fileFormData: FormData) => {
    return await http.post('/files/', fileFormData, this.config);
  };

  static deleteFile = async (filename: string) => {
    return await http.delete(`${this.URI}/${filename}`);
  };

  static renameFile = async (
    oldName: string,
    newName: string
  ): Promise<never> => {
    return await http.patch(`/file/${oldName}/${newName}`, {}, this.config);
  };
}
