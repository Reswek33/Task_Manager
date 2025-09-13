import type { Request, Response } from 'express';
import { readTasks, writeTasks } from '../utils/FileHandler';
import {type Task } from '../models/task';

export const getAllTasks = (req: Request, res: Response) => {
  const status = req.query.status as string;
  let tasks = readTasks();
  if (status) {
    tasks = tasks.filter(task => task.status === status);
  }
  res.json(tasks);
};

export const getTaskById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? '');
  const task = readTasks().find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

export const createTask = (req: Request, res: Response) => {

   const body = req.body;

   if(!body){
    return res.status(400).json({error:"page not found"})
   }
  const { title, description } = req.body;
  

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const tasks = readTasks();
  const newTask: Task = {
    id: Date.now(),
    title,
    description,
    status: 'pending',
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? '');
  const { title, description, status } = req.body;
  const tasks = readTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  const task = tasks[taskIndex];
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks[taskIndex] = {
    ...task,
    title: title ?? task.title,
    description: description ?? task.description,
    status: status ?? task.status,
  };

  writeTasks(tasks);
  res.json(tasks[taskIndex]);
};

export const deleteTask = (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? '');
  const tasks = readTasks();
  const newTasks = tasks.filter(t => t.id !== id);

  if (tasks.length === newTasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }

  writeTasks(newTasks);
  res.status(204).send();
};