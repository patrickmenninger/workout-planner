import express from 'express';

import workoutRouter from './routes/workoutRoutes.mjs';
import exerciseRouter from './routes/exerciseRoutes.mjs';
import planRouter from './routes/planRoutes.mjs';

const app = express();
app.use(express.json());

// Add the workout routes
app.use('/api/workouts', workoutRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/plans', planRouter);

export default app;
