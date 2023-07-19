import { User } from "../../models/user";


   

export interface CreateUserParams{
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}
export interface ICreateUserRepository{
    createUser(params: CreateUserParams): Promise<User>;
}

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    INTERNAL_SERVER_ERROR = 500,
  }