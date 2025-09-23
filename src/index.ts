import express from 'express';
import taskRoutes from './routes/taskRoutes';
import statsRoutes from './routes/statsRoutes'

const app = express();
app.use(express.json());

app.use('/tasks', taskRoutes);

app.use('/stats' , statsRoutes)

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});