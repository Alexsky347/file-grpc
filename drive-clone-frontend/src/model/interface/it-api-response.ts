import { ItErrors } from './it-errors';

interface ItApiResponse<T> {
  status: number;
  errors: ItErrors[];
  data: T;
}
