

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

interface Task {
  taskId: string;  
  userId: string;  
  title: string;
  description: string;
  completed: boolean;
}