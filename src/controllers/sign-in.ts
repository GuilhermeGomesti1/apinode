import { User } from "../models/user";
import { ok, serverError, unauthorized } from "./helpers"; 
import { HttpResponse, IController, HttpRequest } from "./protocols";


export class SignInController implements IController {
  constructor(private readonly signInRepository: ISignInRepository) {}

  async handle(httpRequest: HttpRequest<{ email?: string, password?: string }>): Promise<HttpResponse<User | string>> {
    try {
      const { email, password } = httpRequest.body || {}; // Tratando o caso em que httpRequest.body é undefined

      if (!email || !password) {
        return unauthorized("Credenciais inválidas"); // Retorna resposta de não autorizado caso email ou password estejam faltando
      }

      const user = await this.signInRepository.signIn(email, password);
      
      if (user) {
        return ok<User>(user);
      } else {
        return unauthorized("Credenciais inválidas");
      }
    } catch (error) {
      return serverError();
    }
  }
}

export interface ISignInRepository {
  signIn(email: string, password: string): Promise<User | null>;
}