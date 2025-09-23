export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'inProgress'|'completed';
  category? : string;
  deleted? : boolean;
  createdAt : string;
  updatedAt : string
}