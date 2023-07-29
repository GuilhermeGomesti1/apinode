import { HttpRequest, HttpResponse, IController } from "../protocols";
import { CreateTaskParams } from "../protocols";
import { Task } from "../protocols";
import { ITaskRepository } from "../protocols";
import { decodeToken } from "../../auth"; // Importa a função 'decodeToken'
import { MongoClient } from "../../database/mongo";
import dotenv from "dotenv";
import { unauthorized } from "../helpers";

dotenv.config();

export class CreateTaskController implements IController {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateTaskParams>
  ): Promise<HttpResponse<Task | string>> {
    try {
      const { title, description} = httpRequest.body || {};
      console.log("Credenciais recebidas:", { title, description });
       if (!title || !description) {
        console.log("Dados inválidos");
        return unauthorized("Dados inválidos"); // Retorna resposta de não autorizado caso title ou description estejam faltando
      }

      console.log('httpRequest get ',httpRequest);
      
      const authorizationHeader = httpRequest?.headers?.Authorization;
      if (!authorizationHeader) {
        // Se o cabeçalho de autorização não estiver presente, retorne uma resposta de não autorizado
        return {
          statusCode: 401,
          body: 'Token de autorização não fornecido',
        };
      }
      
      console.log('httpRequest header',httpRequest?.headers)
      console.log("Authorization header:", authorizationHeader);

      const token = authorizationHeader?.split("Bearer ")[1]; // Extrai o token do cabeçalho de autorização
      console.log("token:",token)

      if (!token) {
        console.log("Token não fornecido");
        return unauthorized("Token não fornecido");
      }
  // Decodifica o token para obter o ID do usuário associado a ele
  const decodedToken = decodeToken(token);
  const userIdFromToken = decodedToken.userId;
  console.log("ID do usuário a partir do token:", userIdFromToken);

  const task: Task = {
    taskId: generateId(),
    userId: userIdFromToken,
    title,
    description,
    completed: false,
  
  };
// Adiciona a tarefa ao usuário no banco de dados
const createdTask = await this.taskRepository.createTask(task);
console.log("Tarefa criada:", createdTask);

      // Decodifica o token JWT para obter o userId
     // Atualiza a coleção de usuários no banco de dados
     const userCollection = MongoClient.db.collection("users");
     await userCollection.updateOne(
       { userId: userIdFromToken },
       { $push: { tasks: createdTask.taskId } }
     );
      console.log("Created Task:", createdTask);
      console.log(
        "User ID do usuário após a criação da task:",
        userIdFromToken
      );

      return {
        statusCode: 201,
        body: createdTask,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in CreateTaskController:", error.message);
        return {
          statusCode: 500,
          body: `Something went wrong: ${error.message}`,
        };
      } else {
        console.error("Error in CreateTaskController:", error);
        return {
          statusCode: 500,
          body: "Something went wrong",
        };
      }
    }
  }
}

export function generateId(): string {
  const timestamp = Date.now().toString(16);
  const random = Math.random().toString(16).slice(2, 8);

  return timestamp + random;
}
