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
                order_index,
                workout:workouts(*)
            )
        `)
        .eq('user_id', req.user.id)

    if (error) return res.status(500).json({error: error.message});

    const cleanPlans = data.map(plan => {
        plan.workouts = plan.plan_workouts.map(workout => {
            const formattedWorkout = workout.workout;
            formattedWorkout.order_index = workout.order_index;

            return formattedWorkout;
        });
        delete plan.plan_workouts;
        return plan;
    })

    res.json(cleanPlans);
});

export default router;