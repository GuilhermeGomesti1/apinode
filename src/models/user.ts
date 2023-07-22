import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: Task[];
  token?: string;
  username: string; // Adicione a propriedade 'username'
}

export interface Task {
  id: string;
  title:string;
  description: string;
  completed:boolean;
}