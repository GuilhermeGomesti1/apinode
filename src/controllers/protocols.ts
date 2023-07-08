export interface HttpResponse<T> {
  statusCode: number;
  body: T ;
}

export interface HttpRequest<B> {
  params?: any;
  headers?: any;
  body?: B;
}

export interface IController {
  handle(httpReques: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;

  }
