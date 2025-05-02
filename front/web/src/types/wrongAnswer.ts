export interface WrongAnswer {
  id: number;
  name: string;
}

export interface WrongAnswerResponse {
  success: boolean;
  errorMsg: string | null;
  errorCode: string | null;
  data: WrongAnswer[];
}
