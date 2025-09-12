import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
}  from '../controllers/taskController.js';

const router = express.Router();


router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);



export default router;