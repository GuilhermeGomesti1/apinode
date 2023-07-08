import { HttpResponse, HttpStatusCode } from "./protocols";

export const ok = <T> (body: any): HttpResponse<T> => 
({statusCode: HttpStatusCode.OK, body });
export const created = <T>(body: any): HttpResponse<T> => ({statusCode: HttpStatusCode.CREATED, body });

export const BadRequest = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.BAD_REQUEST,
    body: message,
  };
};


export const serverError = (): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.SERVER_ERROR,
    body: "Something went wrong"
  };
};