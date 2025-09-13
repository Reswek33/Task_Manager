export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}