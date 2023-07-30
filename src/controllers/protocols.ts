import { User } from "../models/user";
import { Task } from "../models/user";
export interface HttpResponse<T> {
  statusCode: HttpStatusCode;
  body: T;
}
export interface ISignInRepository {
  signIn(email: string, password: string): Promise<User | null>;
}
export interface HttpRequest<B> {
  params?: any;
  headers?: { [key: string]: string } | undefined;
  body?: B;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
export interface IController {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;
}

export interface CreateTaskParams {
  userId?: string;
  title?: string;
  description?: string;

  authorizationHeader?: string;
}

export interface GetTasksHttpRequest extends HttpRequest<Record<string, never>> {
  params: {
    userId: string;
  };
}

export interface ITaskRepository {
  getTasksByUserId(userIdFromToken: string): Promise<Task[]>;
  createTask(task: Task): Promise<Task>;
  //deleteTaskById(taskId: string): Promise<boolean>;

}

