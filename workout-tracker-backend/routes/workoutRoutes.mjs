import express from 'express';
import {TokenMiddleware} from '../middleware/TokenMiddleware.mjs';
import supabase from '../services/supabase.mjs';

const router = express.Router();

router.get('/', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('workouts')
        .select(`
            *,
            workout_exercises (
                *,
                exercise: exercises (*)
            )
        `)
        .eq('user_id', req.user.id)

    if (error) return res.status(500).json({error: error.message});

    // Format data
    const cleanWorkouts = data.map(workout => {
        workout.exercises = workout.workout_exercises.map(exercise => {
            const formattedExercise = {};
            formattedExercise.model = exercise.exercise
            formattedExercise.info = exercise;

            delete formattedExercise.info.exercise;

            return formattedExercise;
        });
        delete workout.workout_exercises;

        return workout;
    })

    res.json(cleanWorkouts);
});

router.post("/", TokenMiddleware, async (req, res) => {
    const {data, error}  = await supabase
        .from("workouts")
        .insert(req.body)
        .select()
    
    if (error) return res.status(500).json({error: error.message});

    res.status(201).send(data[0].id);

});

router.post("/:id/exercises", TokenMiddleware, async (req, res) => {
    console.log("hit");
    const {error} = await supabase
        .from("workout_exercises")
        .insert(req.body)

    if (error) return res.status(500).json({error: error.message});

    res.sendStatus(201);
})

router.get('/history', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('workout_history')
        .select('*')
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({error: error.message});

    const workoutHistory = data;

    const workoutAndExerciseHistory = await Promise.all(
            workoutHistory.map(async (workout) => {

            const {data, error} = await supabase
                .from('exercise_history')
                .select(`
                    *,
                    model: exercises(*)
                `)
                .eq('user_id', req.user.id)
                .eq('user_workout_id', workout.id);

            if (error) return res.status(500).json({error: error.message});

            workout.exercises = data;
            return workout;

        })
    );

    res.json(workoutAndExerciseHistory);

});

router.post("/history", TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from("workout_history")
        .insert({
            user_id: req.user.id, 
            start_date: req.body.start_date, 
            end_date: req.body.end_date, 
            notes: req.body.notes, 
            workout_name: req.body.workout_name
        })
        .select()

    if (error) return res.status(500).json({error: error.message});

    res.status(201).send(data[0].id);

});

router.put("/:id", TokenMiddleware, async (req, res) => {

    if (req.body.workout.name || req.body.workout.notes) {
        const {error} = await supabase
            .from("workouts")
            .update(req.body.workout)
            .eq("id", req.params.id);

        if (error) return res.status(500).json({error: error.message});
    }

    if (req.body.old_exercises) {
        const updates = req.body.old_exercises.map(exercise => {
            const { id, ...fieldsToUpdate } = exercise;

            return supabase
                .from("workout_exercises")
                .update(fieldsToUpdate)
                .eq("id", id);
        });

        const results = await Promise.all(updates);

        // Check for errors
        results.forEach(({ error }, i) => {
            if (error) return res.status(500).json({error: error.message});
        });
    }

    if (req.body.new_exercises) {
        const {error} = await supabase
            .from("workout_exercises")
            .insert(req.body.new_exercises);

        if (error) return res.status(500).json({error: error.message});
    }

    res.sendStatus(200);
    
})

export default router;