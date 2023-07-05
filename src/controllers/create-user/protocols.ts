import { User } from "../../models/user"

export interface CreateUserParams{
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}
export interface ICreateUserRepository{
    createdUser(params: CreateUserParams): Promise<User>;
}