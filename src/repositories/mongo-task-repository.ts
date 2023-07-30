import { ObjectId } from "mongodb";
import { ITaskRepository} from "../controllers/protocols";
import { Task } from "../models/user";
import { MongoClient } from "../database/mongo";
import { User } from "../models/user";
export class MongoTaskRepository implements ITaskRepository {
  async createTask(task: Task): Promise<Task> {
    console.log("Task being saved:", task);

    const result = await MongoClient.db
      .collection<Task>("tasks")
      .insertOne(task);
    const { insertedId } = result;

    const createdTask = await MongoClient.db
      .collection<Task>("tasks")
      .findOne({ _id: insertedId });

    if (!createdTask) {
      throw new Error("Failed to create task");
    }
    console.log("Task saved in the database:", createdTask);

    return createdTask;
  }



  async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      const tasks = await MongoClient.db
        .collection<Task>("tasks")
        .find({ userId: userId })
        .toArray();

      return tasks;
    } catch (error) {
      console.error("Error in getTasksByUserId:", error);
      throw new Error("Failed to get tasks by user ID");
    }
  }

}
