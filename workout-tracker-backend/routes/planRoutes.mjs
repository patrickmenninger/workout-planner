import express from 'express';
import {TokenMiddleware} from '../middleware/TokenMiddleware.mjs';
import supabase from '../services/supabase.mjs';

const router = express.Router();

router.get('/', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('plans')
        .select(`
            *,
            plan_workouts (
                workout:workouts(*)
            )
        `)
        .eq('user_id', req.user.id)
        .order('start_date', { ascending: false});

    if (error) return res.status(500).json({error: error.message});

    const planWithWorkouts = data.map(plan => {
        const updatedPlan = {
            ...plan,
            workouts: plan.plan_workouts.map(pw => pw.workout)
        };

        delete updatedPlan.plan_workouts;
        return updatedPlan;
    });

    res.json(planWithWorkouts);
});

export default router;