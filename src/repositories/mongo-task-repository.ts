
import { ITaskRepository , Task} from "../controllers/protocols";
import { MongoClient } from "../database/mongo";
export class MongoTaskRepository implements ITaskRepository {
    async createTask(task: Task): Promise<Task> {
        console.log("Task being saved:", task);
      const { insertedId } = await MongoClient.db
        .collection<Task>('tasks')
        .insertOne(task);
  
      const createdTask = await MongoClient.db
        .collection<Task>('tasks')
        .findOne({ _id: insertedId });
  
    if (!createdTask) {
      throw new Error('Failed to create task');
    }

    return createdTask;
  }
}