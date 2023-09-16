import http from './http-common';
import { AuthService } from './auth.service';
import { Config } from '@/models/interface/config';
import { AxiosRequestConfig } from 'axios';

export class FileService {
  private config: AxiosRequestConfig<any> = {
    headers: {
      Authorization: AuthService.getBearer(),
      'Content-Type': 'multipart/form-data',
    },
  };

  async getFiles(limit: number, pageNumber: number, orderBy: string) {
    try {
      const response = await http.get(
        `/files?limit=${limit}&pageNumber=${pageNumber}&orderBy=${orderBy}`,
        this.config,
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  async getFile(fileName: string) {
    this.config.responseType = 'blob';
    return http.get(`/file/${fileName}`, this.config);
  }
  

  async uploadOneFile(fileFormData: FormData) {
    try {
      const response = await http.post(`/file/`, fileFormData, this.config);
      return response;
    } catch (e) {
      return e;
    }
  }

  async uploadMultipleFiles(fileFormData: FormData) {
    try {
      const response = await http.post(`/files/`, fileFormData, this.config);
      return response;
    } catch (e) {
      return e;
    }
  }

  async deleteFile(filename: string) {
    try {
      const response = await http.delete(`/file/${filename}`, this.config);
      return response;
    } catch (e) {
      return e;
    }
  }

  async renameFile(oldName: string, newName: string): Promise<any> {
    try {
      const response = await http.patch(
        `/file/${oldName}/${newName}`,
        {},
        this.config,
      );
      return response;
    } catch (e) {
      return e;
    }
  }
}
