import express from 'express';
import {TokenMiddleware} from '../middleware/TokenMiddleware.mjs';
import supabase from '../services/supabase.mjs';

const router = express.Router();

// Get all exercises
router.get('/', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('exercises')
        .select('*');

    if (error) return res.status(500).json({error: error.message});

    res.json(data);
});

// Get a users exercise history
router.get('/history', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('exercise_history')
        .select(`
            *,
            model: exercises(*)
        `)
        .eq('user_id', req.user.id)

    if (error) return res.status(500).json({error: error.message});

    res.json(data);

});

router.post('/history', TokenMiddleware, async (req, res) => {
    // take array of exercise history and update
    console.log(req.body);
    
    const {error} = await supabase
        .from("exercise_history")
        .insert(req.body);

    if (error) return res.status(500).json({error: error.message});

    res.sendStatus(201);
})

export default router;