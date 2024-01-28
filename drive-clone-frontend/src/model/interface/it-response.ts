export interface ItResponse {
  status: number;
  message: string;
  data: {
    [key: string]: any;
  };
  response: {
    [key: string]: any;
  };
}
