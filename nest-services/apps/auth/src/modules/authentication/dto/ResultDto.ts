import { ResultStatus } from '../types/result-status';

export interface Result {
  result: ResultStatus;
  message: string;
}

export class ResultDto implements Result {
  result!: ResultStatus;

  message!: string;
}
