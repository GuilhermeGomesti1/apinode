import { ObjectId } from "mongodb";


export interface User {
  
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: Task[];
  token?: string;
  username: string; 
}

 export interface Task {
  _id?: string |ObjectId;
  taskId: string;  
  userId: string;  
  title: string;
  description: string;
  completed: boolean;
}