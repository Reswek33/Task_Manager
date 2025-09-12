import type { Request, Response } from 'express';
import { readTasks, writeTasks } from '../utils/FileHandler.js';
import {type Task } from '../models/task.js';


export const getAllTasks = (req: Request, res: Response) => {
  const status = req.query.status as string;
  let tasks = readTasks();
  if (status) {
    tasks = tasks.filter(task => task.status === status);
  }

  
  res.json(tasks);
};

export const getTaskById = (req: Request, res: Response) => {
  
  const id = parseInt(req.params.id);
  const task = readTasks().find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

export const createTask = (req: Request, res: Response) => {
  const { title, description } = req.body;


  // if (!title || !description) {
  //   return res.status(400).json({ error: 'Title and description are required' });
  // }


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