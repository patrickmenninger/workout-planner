import express from 'express';
import {TokenMiddleware} from '../middleware/TokenMiddleware.mjs';
import supabase from '../services/supabase.mjs';

const router = express.Router();

router.get('/', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('workouts')
        .select('*, user_exercises(*), user_runs(*)')
        .eq('user_id', req.user.id)
        .order('workout_date', { ascending: false});

    if (error) return res.status(500).json({error: error.message});

    res.json(data);
});

export default router;