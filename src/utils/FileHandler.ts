import fs from 'fs';
import path from 'path';
import { type Task } from '../models/task.js';

const filePath = path.join(__dirname, '../data/tasks.json');

export const readTasks = (): Task[] => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeTasks = (tasks: Task[]) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};