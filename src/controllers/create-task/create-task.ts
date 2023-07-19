import { HttpRequest, HttpResponse, IController } from "../protocols";
import { CreateTaskParams } from "../protocols";
import { Task } from "../protocols";
import { ITaskRepository } from "../protocols";

export class CreateTaskController implements IController{
    constructor(private readonly taskRepository: ITaskRepository){}
    async handle(
        httpRequest: HttpRequest<CreateTaskParams>
      ): Promise<HttpResponse<Task | string>> {
        try {
          const { title, description } = httpRequest.body || {};
    
          if (!title || !description) {
            return {
              statusCode: 400,
              body: 'Title and description are required',
            };
          }
    
          const task: Task = {
            id: 'generated-id',
            userId:httpRequest.body?.userId || '',
            title,
            description,
            completed: false,
          };
    
    
          const createdTask = await this.taskRepository.createTask(task);
    
          return {
            statusCode: 201,
            body: createdTask,
          };
        } catch (error) {
          return {
            statusCode: 500,
            body: 'Something went wrong',
          };
        }
      }
    }
    
    function generateId(): string {
        const timestamp = Date.now().toString(16);
        const random = Math.random().toString(16).slice(2, 8); 
      
        return timestamp + random; 
      }