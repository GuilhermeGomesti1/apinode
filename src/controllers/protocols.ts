import { User } from "../models/user";


export interface HttpResponse<T> {
  statusCode: HttpStatusCode;
  body: T ;
}
export interface ISignInRepository {
  signIn(email: string, password: string): Promise<User | null>;
}
export interface HttpRequest<B> {
  params?: any;
  headers?: any;
  body?: B;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}
export interface IController {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;

  }


  export interface CreateTaskParams {
    userId: string,
    title:string,
    description: string,
  }

  export interface ITaskRepository{
    createTask(task: Task): Promise<Task>;
  }

  export interface Task {
    taskId: string;  
    userId: string;  
    title: string;
    description: string;
    completed: boolean;
  }