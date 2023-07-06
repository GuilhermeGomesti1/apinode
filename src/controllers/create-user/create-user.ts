import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  CreateUserParams,
  ICreateUserController,
  ICreateUserRepository,
} from "./protocols";

export class CreateUserController implements ICreateUserController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
        //VALIDAR SE BODY EXISTE
        if (!httpRequest.body){
            return { 
                statusCode: 400,
                body: 'Please especifu a body'
            }
        }

   
      const user = await this.createUserRepository.createUser(httpRequest.body);
      return {
        statusCode: 201,
        body:user,
      }
    } catch (error) {
        return{
            statusCode: 500,
            body:"Something went wrong."
        }
    }
  }
}
