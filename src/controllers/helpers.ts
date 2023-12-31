import { HttpResponse, HttpStatusCode} from "./protocols";

export const ok = <T>(body: any): HttpResponse<T> => 
({statusCode: HttpStatusCode.OK, body });

export const created = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttpStatusCode.CREATED, body });

export const BadRequest = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.BAD_REQUEST,
    body: message,
  };
};
export const unauthorized = (message: string): HttpResponse<string> => ({
  statusCode: HttpStatusCode.UNAUTHORIZED,
  body: message,
});


export const serverError = (): HttpResponse<string> => {
  return {
    statusCode: 500,
    body: "Something went wrong"
  };
};

export const notFound = (message: string): HttpResponse<string> => ({
  statusCode: HttpStatusCode.NOT_FOUND,
  body: message,
});