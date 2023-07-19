export interface User {
  id:string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks:[];
}


export interface Task {
  id: string;
  title:string;
  description: string;
  completed:boolean;
}