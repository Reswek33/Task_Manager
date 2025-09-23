import type { Request, Response } from 'express';
import { readTasks, writeTasks } from '../utils/FileHandler';
import {type Task } from '../models/task';
import { parse } from 'path';

export const getAllTasks = (req: Request, res: Response) => {

  let tasks: Task[] = readTasks();
  const {status, category, search, page = 2, limit = 5, includeDeleted = 'false'} = req.query;

  if (includeDeleted === 'true'){
    tasks = tasks.filter(task => !task.deleted);
  }

  if (status) {
    tasks = tasks.filter(task => task.status === status)
  }

  if (category){
    tasks = tasks.filter(task => task.category === category)
  }
  if (search) {
    const term  = (search as string).toLowerCase();
    tasks = tasks.filter(task => task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term));
  }

  const start = (Number(page) - 1) * Number(limit);
  const paginated = tasks.slice(start, start + Number(limit));

  res.json(paginated);


  
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
  const { title, description, category } = req.body;
  

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description and category are required' });
  }

  const tasks = readTasks();
  const newTask: Task = {
    id: Date.now(),
    title,
    description,
    status: 'pending',
    category: category || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? '');
  const { title, description, status , category } = req.body;
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
    category: category ?? task.category
  };

  writeTasks(tasks);
  res.json(tasks[taskIndex]);
};
export const getStats = (req: Request, res: Response) => {

    const { includeDeleted } =req.query;
    let tasks = readTasks();
    if (includeDeleted === 'true'){
      tasks = tasks.filter(task => !task.deleted);
    };

    if(!tasks ){
       return res.status(404).json({error: "tasks not found"})
    }

    const stats = {
      totalTasks: tasks.length,
      pending: tasks.filter(task =>task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'inProgress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
      byCategory: {} as Record <string, number>
    };

    tasks.forEach(task => {
      if(task.category){
        stats.byCategory[task.category] = (stats.byCategory[task.category] || 0)+ 1;
      }
      
    });

    res.json(stats);
    

     
  }

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