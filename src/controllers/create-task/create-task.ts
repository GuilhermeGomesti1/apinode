import { HttpRequest, HttpResponse, IController } from "../protocols";
import { CreateTaskParams } from "../protocols";
import { Task } from "../protocols";
import { ITaskRepository } from "../protocols";
import jwt, { Secret } from 'jsonwebtoken';
import { MongoClient } from "../../database/mongo";
import dotenv from "dotenv";
import { TokenPayload } from '../../auth';

dotenv.config();

export function decodeToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.log("Erro ao decodificar o token:", (error as Error).message);
    throw new Error("Invalid token: unable to decode");
  }
}

export function generateToken(payload: TokenPayload): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as Secret);

  return token;
}

export class CreateTaskController implements IController {
  constructor(private readonly taskRepository: ITaskRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateTaskParams>
  ): Promise<HttpResponse<Task | string>> {
    await new Promise((resolve) => setTimeout(resolve, 0)); // Esperar por uma microtarefa
    


    try {
      const { title, description } = httpRequest.body || {};
      const authorizationHeader = httpRequest?.headers?.['authorization'];

      console.log("Authorization Header:", authorizationHeader)

      if (!authorizationHeader) {
        return {
          statusCode: 401,
          body: "Authorization header missing",
        };
      }
      if (!httpRequest.headers) {
        return {
          statusCode: 400,
          body: "Headers missing",
        };
      }
      
      const token = authorizationHeader.split(" ")[1] ;
      console.log("Token:", token);
      // Verifica se todas as informações necessárias estão presentes
      if (!title || !description || !token) {
        return {
          statusCode: 400,
          body: "Title, description, and token are required",
        };
      }

      // Decodifica o token JWT para obter o userId
      const decodedToken = decodeToken(token);
      const userIdFromToken = decodedToken.userId;
      
      console.log("userIdFromToken:", userIdFromToken);

      // Verifica se a variável userIdFromToken contém um valor válido
      if (!userIdFromToken) {
        return {
          statusCode: 400,
          body: "Invalid token: userId not found in token payload",
        };
      }

      // Cria a tarefa com o ID do usuário obtido do token
      const task: Task = {
        taskId: generateId(),
        userId: userIdFromToken,
        title,
        description,
        completed: false,
      };

      // Adiciona a tarefa ao usuário no banco de dados
      const createdTask = await this.taskRepository.createTask(task);
      console.log("Created Task:", createdTask);
      // Atualiza a coleção de usuários no banco de dados
      const userCollection = MongoClient.db.collection("users");
      await userCollection.updateOne(
        { userId: userIdFromToken },
        { $push: { tasks: createdTask.taskId } }
      );

      console.log("Created Task:", createdTask);
      console.log("User ID do usuário após a criação da task:", userIdFromToken);

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
