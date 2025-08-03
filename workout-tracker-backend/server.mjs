import express from 'express';
import cors from 'cors';

import workoutRouter from './routes/workoutRoutes.mjs';
import exerciseRouter from './routes/exerciseRoutes.mjs';
import planRouter from './routes/planRoutes.mjs';

const app = express();
app.use(cors());
app.use(express.json());

// Add the workout routes
app.use('/api/workouts', workoutRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/plans', planRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
