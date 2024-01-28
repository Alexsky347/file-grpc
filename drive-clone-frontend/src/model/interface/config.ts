export interface Config {
  headers: {
    Authorization: string | object;
    'Content-Type': string;
  };
  responseType?: string;
}
