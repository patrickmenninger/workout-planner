import express from 'express';
import {TokenMiddleware} from '../middleware/TokenMiddleware.mjs';
import supabase from '../services/supabase.mjs';

const router = express.Router();

router.get('/', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('plans')
        .select(`
            *,
            plan_workouts (*)
        `)
        .eq('user_id', req.user.id)

    if (error) return res.status(500).json({error: error.message});

    const cleanPlans = data.map(plan => {
        plan.workouts = plan.plan_workouts;
        delete plan.plan_workouts;
        return plan;
    })

    res.json(cleanPlans);
});

router.get('/workouts', TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from('plan_workouts')
        .select(`
            *,
            plan_workout_exercises (
                *,
                exercise: exercises (*)
            )
        `)
        .eq('user_id', req.user.id)

    if (error) return res.status(500).json({error: error.message});

    // Format data
    const cleanWorkouts = data.map(workout => {
        workout.exercises = workout.plan_workout_exercises.map(exercise => {
            const formattedExercise = {};
            formattedExercise.model = exercise.exercise
            formattedExercise.info = exercise;

            delete formattedExercise.info.exercise;

            return formattedExercise;
        });
        delete workout.plan_workout_exercises;

        return workout;
    })

    res.json(cleanWorkouts);
});

router.post("/", TokenMiddleware, async (req, res) => {
    const {data, error} = await supabase
        .from("plans")
        .insert(req.body)
        .select();

    if (error) return res.status(500).json({error: error.message});

    res.status(201).send(data[0].id);
});

router.delete("/:id", TokenMiddleware, async (req, res) => {
    const {error} = await supabase
        .from("plans")
        .delete()
        .eq("id", req.params.id);

    if (error) return res.status(500).json({error: error.message});

    res.sendStatus(200);
});

router.put("/:id", TokenMiddleware, async (req, res) => {

    // Edit workout info
    if (req.body.plan.name || req.body.plan.notes) {
        const {error} = await supabase
            .from("plans")
            .update(req.body.plan)
            .eq("id", req.params.id);

        if (error) return res.status(500).json({error: "Editing plan: " + error.message});
    }

    // Edit workout info
    let insertData;
    if (req.body.workouts) {

        // Add new workouts
        const newPlanWorkouts = req.body.workouts.filter(workout => !workout.id);

        const {data, error: insertError} = await supabase
            .from("plan_workouts")
            .insert(newPlanWorkouts)
            .select();

        if (insertError) return res.status(500).json({error: "Inserting Plan Workouts: " + insertError.message});
        insertData = data;

        // Update old workouts
        const updatedPlanWorkouts = req.body.workouts.filter(workout => workout.id);

        const {error: updateError} = await supabase
            .from("plan_workouts")
            .upsert(updatedPlanWorkouts, {onConflict: 'id'});

        if (updateError) return res.status(500).json({error: "Updating Plan Workouts: " + updateError.message});

    }

    // Delete workouts
    const workoutIds = req.body.workouts
        .filter(workout => workout.id)
        .map(workout => workout.id);

    const createdPlanWorkoutIds = insertData ? insertData.map(workout => workout.id) : []

    const combinedIds = workoutIds.concat(createdPlanWorkoutIds);

    const {error} = await supabase
        .from("plan_workouts")
        .delete()
        .not("id", "in", `(${combinedIds.join(',')})`)
        .eq("plan_id", req.params.id)

    if (error) return res.status(500).json({error: "Deleting Plan Workouts: " + error.message});

    res.status(200).json(insertData);
})

router.put("/:planId/workouts/:workoutId", TokenMiddleware, async (req, res) => {

    console.log(req.params.workoutId, req.body);

    // Edit workout info
    if (req.body.workout.name || req.body.workout.notes) {
        const {error} = await supabase
            .from("plan_workouts")
            .update(req.body.workout)
            .eq("id", req.params.workoutId);

        if (error) return res.status(500).json({error: "Editing workout: " + error.message});
    }

    // Edit exercise info
    let insertData;
    if (req.body.exercises) {

        // Add new exercises
        const newWorkoutExercises = req.body.exercises.filter(exercise => !exercise.id);

        const {data, error: insertError} = await supabase
            .from("plan_workout_exercises")
            .insert(newWorkoutExercises)
            .select();

        if (insertError) return res.status(500).json({error: "Inserting Exerciess: " + insertError.message});
        insertData = data;

        // Update old exercises
        const updatedWorkoutExercises = req.body.exercises.filter(exercise => exercise.id);

        const {error: updateError} = await supabase
            .from("plan_workout_exercises")
            .upsert(updatedWorkoutExercises, {onConflict: 'id'});

        if (updateError) return res.status(500).json({error: "Updating Exercises: " + updateError.message});

    }

    // Delete exercises
    const exerciseIds = req.body.exercises
        .filter(exercise => exercise.id)
        .map(exercise => exercise.id);

    const createdWorkoutExerciseIds = insertData ? insertData.map(exercise => exercise.id) : []

    const combinedIds = exerciseIds.concat(createdWorkoutExerciseIds);

    const {error} = await supabase
        .from("plan_workout_exercises")
        .delete()
        .not("id", "in", `(${combinedIds.join(',')})`)
        .eq("workout_id", req.params.workoutId)

    if (error) return res.status(500).json({error: "Deleting Exercises: " + error.message});

    res.sendStatus(200);
    
});

export default router;