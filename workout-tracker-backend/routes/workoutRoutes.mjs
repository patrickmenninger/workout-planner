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

    // Edit workout info
    if (req.body.workout.name || req.body.workout.notes) {
        const {error} = await supabase
            .from("workouts")
            .update(req.body.workout)
            .eq("id", req.params.id);

        if (error) return res.status(500).json({error: error.message});
    }

    // Edit exercise info
    let insertData;
    if (req.body.exercises) {

        // Add new exercises
        const newWorkoutExercises = req.body.exercises.filter(exercise => !exercise.id);

        const {data, error: insertError} = await supabase
            .from("workout_exercises")
            .insert(newWorkoutExercises)
            .select();

        if (insertError) return res.status(500).json({error: insertError.message});
        insertData = data;

        // Update old exercises
        const updatedWorkoutExercises = req.body.exercises.filter(exercise => exercise.id);

        const {error: updateError} = await supabase
            .from("workout_exercises")
            .upsert(updatedWorkoutExercises, {onConflict: 'id'});

        if (updateError) return res.status(500).json({error: updateError.message});

    }

    // Delete exercises
    const exerciseIds = req.body.exercises
        .filter(exercise => exercise.id)
        .map(exercise => exercise.id);

    const createdWorkoutExerciseIds = insertData.map(exercise => exercise.id);

    const combinedIds = exerciseIds.concat(createdWorkoutExerciseIds);

    const {error} = await supabase
        .from("workout_exercises")
        .delete()
        .not("id", "in", `(${combinedIds.join(',')})`)
        .eq("workout_id", req.params.id)

    if (error) return res.status(500).json({error: error.message});

    res.sendStatus(200);
    
});

router.delete("/:id", TokenMiddleware, async (req, res) => {
    const {error} = await supabase
        .from("workouts")
        .delete()
        .eq("id", req.params.id)

    if (error) return res.status(500).json({error: error.message});

    res.sendStatus(200);
})

export default router;