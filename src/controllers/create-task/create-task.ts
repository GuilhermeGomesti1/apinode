import { HttpRequest, HttpResponse, IController } from "../protocols";
import { CreateTaskParams } from "../protocols";
import { Task } from "../protocols";
import { ITaskRepository } from "../protocols";
import jwt, { Secret } from 'jsonwebtoken';
import { MongoClient } from "../../database/mongo";
import dotenv from "dotenv";
import { TokenPayload } from '../../auth'

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

export class CreateTaskController implements IController {
  constructor(private readonly taskRepository: ITaskRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateTaskParams>
  ): Promise<HttpResponse<Task | string>> {
    try {
      const { title, description } = httpRequest.body || {};
      const token = httpRequest.headers.authorization?.split(" ")[1]; // Obtém o token do cabeçalho da requisição
      if (!title || !description || !token) {
        return {
          statusCode: 400,
          body: "Title, description, and token are required",
        };
      }
      const decodedToken = decodeToken(token); // Decodifica o token JWT
      const userId = decodedToken.userId;

      const task: Task = {
        id: generateId(),
        userId: userId,
        title,
        description,
        completed: false,
      };

      const createdTask = await this.taskRepository.createTask(task);
      console.log("Created Task:", createdTask);
      const userCollection = MongoClient.db.collection("users");
      await userCollection.updateOne(
        { _id: userId },
        { $push: { tasks: createdTask.id } }
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
