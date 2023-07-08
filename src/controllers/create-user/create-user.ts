import validator from "validator";
import { created, serverError } from "../helpers";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse , IController} from "../protocols";
import {
  CreateUserParams,
  
  ICreateUserRepository,
} from "./protocols";
import { BadRequest } from "../helpers";

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string >> {
    try {
      //verificar campos obrigatorios
      const requiredFields = ["firstName", "lastName", "email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          return BadRequest(`Field ${field} is required`)
          
        }
      }

      //verificar se o email é valido
      const emailisValid = validator.isEmail(httpRequest.body!.email);
      if (!emailisValid) {
        return BadRequest("E-mail is invalid" )
       
      }

      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );

      return created<User>(user) ;
        
      
    } catch (error) {
      return serverError();
    }
  }
}
