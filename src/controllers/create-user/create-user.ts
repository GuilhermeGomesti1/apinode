import validator from "validator";
import { created, serverError, BadRequest } from "../helpers";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse , IController} from "../protocols";
import {CreateUserParams, ICreateUserRepository} from "./protocols";
import { v4 as uuidv4 } from 'uuid';


export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string >> {
    try {
      //verificar campos obrigatorios
      const requiredFields = ["firstName", "lastName", "email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {return BadRequest(`Field ${field} is required`);
          return BadRequest(`Field ${field} is required`)
          
        }
      }

        // Verificar se o email é válido
        const email = httpRequest.body?.email;
        if (!email || !validator.isEmail(email)) {
          return BadRequest("E-mail is invalid");
        }
       
        uuidv4();

        
        // Criar novo usuário com array de tarefas vazio
        const user: User = {
         
          id: uuidv4(),
          firstName: httpRequest.body?.firstName || "",
          lastName: httpRequest.body?.lastName || "",
          email: email,
          password: httpRequest.body?.password || "",
          tasks: [],
          username: "",
         
        };
        

      const createdUser = await this.createUserRepository.createUser(user);

      return created<User>(createdUser);
    

     
        
      
    } catch (error) {
      return serverError();
    }
  }
}
