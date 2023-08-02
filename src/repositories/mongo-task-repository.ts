import { ObjectId } from "mongodb";
import { ITaskRepository } from "../controllers/protocols";
import { Task, User } from "../models/user";
import { MongoClient } from "../database/mongo";
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

 
  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const objectIdTaskId = new ObjectId(taskId);
      const task = await MongoClient.db
        .collection<Task>("tasks")
        .findOne({ _id: objectIdTaskId });
  
      return task;
    } catch (error) {
      console.error("Error in getTaskById:", error);
      return null;
    }
  }

  async deleteTaskById(taskId: string): Promise<boolean> {
    try { console.log("Deleting task with ID:", taskId);

     const objectIdTaskId = new ObjectId(taskId);// Converta o taskId para ObjectId

      // Verifique primeiro se a tarefa existe
      const taskToDelete = await MongoClient.db
        .collection<Task>("tasks")
        .findOne({ _id: objectIdTaskId });

      if (!taskToDelete) {
        console.log("Tarefa não encontrada");
        return false;
       
      }
      console.log("Tarefa encontrada:", taskToDelete);
      

      // Realize a exclusão
      const result = await MongoClient.db
      .collection<Task>("tasks")
      .deleteOne({ _id: objectIdTaskId });

      if (result.deletedCount !== 1) {
        console.log("Erro na exclusão da tarefa. Resultado:", result);
        // Algo deu errado com a exclusão, retorne false para indicar falha
        return false;
      }
      console.log("Tarefa excluída com sucesso");
           // Tarefa excluída com sucesso, agora atualize o array de tarefas do usuário
           const updatedUser = await MongoClient.db.collection<User>("users").findOneAndUpdate(
            { tasks: { $elemMatch: { _id: objectIdTaskId } } },
            { $pull: { tasks: { _id: objectIdTaskId } } }
          );
          if (!updatedUser.value) {
            console.log("Erro na atualização do usuário após excluir a tarefa");
            return false;
          }
          console.log("Array de tarefas do usuário atualizado com sucesso");
   
         
      return true;
    } catch (error) {
      console.error("Erro em deleteTaskById:", error);
      throw new Error("Falha ao deletar tarefa");
    }
  } 
  async updateTask(taskId: string, updatedData: Partial<Task>): Promise<Task | null> {
    try {
      const objectIdTaskId = new ObjectId(taskId);
  
      // Verifique primeiro se a tarefa existe
      const existingTask = await MongoClient.db
        .collection<Task>("tasks")
        .findOne({ _id: objectIdTaskId });
  
      if (!existingTask) {
        // Se a tarefa não for encontrada, retorne null para indicar que a atualização não foi bem-sucedida
        return null;
      }
  
      // Atualize apenas as propriedades presentes em updatedData
      const updatedTask = {
        ...existingTask,
        ...updatedData,
      };
  
      // Atualize a tarefa no banco de dados
      const result = await MongoClient.db
        .collection<Task>("tasks")
        .updateOne({ _id: objectIdTaskId }, { $set: updatedTask });
  
      if (result.modifiedCount !== 1) {
        // Se o número de documentos modificados for diferente de 1, algo deu errado com a atualização
        return null;
      }
      console.log("Updating task with ID:", taskId);
      console.log("Updated data:", updatedData);
      return updatedTask;
    } catch (error) {
      console.error("Error in updateTask:", error);
      throw new Error("Failed to update task");
    
    }
    
  }
}

