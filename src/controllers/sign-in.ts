import { User } from "../models/user";
import { ok, serverError, unauthorized } from "./helpers"; 
import { HttpResponse, IController, HttpRequest } from "./protocols";

import { generateToken } from "../auth";

export class SignInController implements IController {
  constructor(private readonly signInRepository: ISignInRepository) {}

  async handle(httpRequest: HttpRequest<{ email?: string, password?: string }>): Promise<HttpResponse<User | string>> {
    try {
      const { email, password } = httpRequest.body || {}; // Tratando o caso em que httpRequest.body é undefined
      console.log("Credenciais recebidas:", { email, password });

      if (!email || !password) {
        return unauthorized("Credenciais inválidas"); // Retorna resposta de não autorizado caso email ou password estejam faltando
      }

      const user = await this.signInRepository.signIn(email, password);
      
      if (user) {
        console.log("Usuário encontrado:", user);

        const userId: string = user.id ? user.id.toString() : ""; // Verificação condicional para evitar 'undefined'

        const token = generateToken({
          userId,
        });

        user.token = token;
        return ok<User>(user);
      } else {
        return unauthorized("Credenciais inválidas");
      }
    } catch (error) {
       console.log("Erro ao lidar com a solicitação de login:", error);
      return serverError();
    }
  }
}

export interface ISignInRepository {
  signIn(email: string, password: string): Promise<User | null>;
}