import { IController, GetTasksHttpRequest , HttpResponse,  } from "../protocols";
import { Task } from "../../models/user";
import { ITaskRepository} from "../protocols";

export class GetTasksController implements IController {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async handle(
    httpRequest: GetTasksHttpRequest
    ): Promise<HttpResponse<Task[] | string>> {
    try {
      const userIdFromToken = httpRequest?.params?.userId; // Obtem o ID do usuário a partir dos parâmetros da requisição

      if (!userIdFromToken) {
        // Se o ID do usuário não estiver presente nos parâmetros, retorne uma resposta de não autorizado
        return {
          statusCode: 401,
          body: "ID do usuário não fornecido",
        };
      }

      // Obtém as tarefas do usuário com base no ID do usuário
      const tasks = await this.taskRepository.getTasksByUserId(userIdFromToken);

      return {
        statusCode: 200,
        body: tasks,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error in GetTasksController:", error.message);
        return {
          statusCode: 500,
          body: `Something went wrong: ${error.message}`,
        };
      } else {
        console.error("Error in GetTasksController:", error);
        return {
          statusCode: 500,
          body: "Something went wrong",
        };
      }
    }
    
  }
  //async deleteTask(taskId: string): Promise<boolean> {
  //  return await this.taskRepository.deleteTaskById(taskId); }

}