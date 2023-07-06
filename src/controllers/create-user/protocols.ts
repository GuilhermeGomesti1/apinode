import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
export interface ICreateUserController{
    handle(httpResquest: HttpRequest<CreateUserParams>): Promise<HttpResponse<User>>;
}

export interface CreateUserParams{
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}
export interface ICreateUserRepository{
    createUser(params: CreateUserParams): Promise<User>;
}