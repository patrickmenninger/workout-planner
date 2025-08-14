import { createContext, useContext, useState } from 'react';
import { addWorkoutExercises, createWorkout, addWorkoutHistory, updateWorkout } from '../services/WorkoutService.mjs';
import { addExerciseHistory } from '../services/ExerciseService.mjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthProvider';
import { useEditPlan } from './PlanContext';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {

  const queryClient = useQueryClient();

  const {user} = useAuth();

  const {editPlan, setEditPlan} = useEditPlan();

  const [workoutData, setWorkoutData] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [exerciseSession, setExerciseSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState('in-session');
  const [editWorkout, setEditWorkout] = useState(null);
  const [finishedSets, setFinishedSets] = useState([]);
  const [planId, setPlanId] = useState(false);

  const workoutHistoryMutation = useMutation({
    mutationFn: async (newWorkoutHistory) => {
        const id = (await addWorkoutHistory(newWorkoutHistory)).data;
        return id;
    },
    onSuccess: () => {
        queryClient.invalidateQueries(['workout_history']);
    }
  });

  
  const exerciseHistoryMutation = useMutation({
    mutationFn: async (newExerciseHistory) => {
        await addExerciseHistory(newExerciseHistory);
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["exercise_history"]);
    },
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async ({newWorkout, workoutExercises}) => {
        const id = (await createWorkout(newWorkout)).data;

        const formattedWorkoutExercises = workoutExercises.map(exercise => {
            return {
                workout_id: id,
                exercise_id: exercise.model.id,
                notes: exercise.info.notes,
                order_index: exercise.info.order_index,
                reps: exercise.info.reps,
                rpe: exercise.info.rpe,
                rest_timer: exercise.info.rest_timer,
                distance: exercise.info.distance,
                time: exercise.info.time,
                weight: exercise.info.weight
            }
        });

        await addWorkoutExercises(formattedWorkoutExercises, id);

    },
    onSuccess: () => {
        queryClient.invalidateQueries(["workouts"]);
    }
  });

  const updateWorkoutMutation = useMutation({
    mutationFn: async ({workout, exercises, id}) => {
        await updateWorkout({workout, exercises}, id);
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["workouts"]);
    }
  });

  const startWorkout = (workout) => {
    
    const workoutCopy = JSON.parse(JSON.stringify(workout));

    setWorkoutData(workoutCopy);

    const currWorkoutSession = {
        user_id: workoutCopy.user_id,
        name: workoutCopy.name,
        notes: workoutCopy.notes,
        start_date: (new Date()).toISOString()
    }
    setWorkoutSession(currWorkoutSession);

    const currExerciseSession = workoutCopy.exercises.map(exercise => {

        return {
            model: {
                name: exercise.model.name,
                id: exercise.model.id,
            },
            info: {
                user_workout_id: "",
                user_id: workoutCopy.user_id,
                notes: "",
                time: exercise.info.time ? [...exercise.info.time] : null,
                distance: exercise.info.distance ? [...exercise.info.distance] : null,
                date: (new Date()).toISOString().split("T")[0],
                weight: exercise.info.weight ? [...exercise.info.weight] : null,
                reps: exercise.info.reps ? [...exercise.info.reps] : null,
                rpe: exercise.info.rpe ? [...exercise.info.rpe] : null,
                sets: exercise.info.sets,
                rest_timer: exercise.info.rest_timer,
                order_index: exercise.info.order_index,
            }
        }
    });

    const initialFinishedSets = workoutCopy.exercises.map(exercise => 
        Array((exercise.info.reps !== null ? exercise.info.reps.length : exercise.info.time.length) || 1).fill(false)
    )
    setFinishedSets(initialFinishedSets);

    setExerciseSession(currExerciseSession);
    setEditMode('in-session');
    setEditWorkout(null);
    setIsOpen(true);
  };

  const openForEdit = (mode, workout, planId) => {

    const workoutCopy = JSON.parse(JSON.stringify(workout));
    setWorkoutData(workoutCopy);

    setPlanId(planId);
    setEditMode(mode);
    setEditWorkout(workoutCopy);
    setIsOpen(true);
  }

  const openOffcanvas = () => setIsOpen(true);
  const closeOffcanvas = () => setIsOpen(false);

  const stopWorkout = () => {
    setFinishedSets([]);
    setWorkoutData(null);
    setIsOpen(false);
    setWorkoutSession(null);
    setExerciseSession(null);
    setEditMode('in-session');
    setEditWorkout(null);
  }

      
  function saveWorkout(name, notes) {
    if (editMode === "pre-session") {

        const formattedWorkout = {
            workout: {
                name: name,
                notes: notes,
            },
            exercises: {
                ...editWorkout.exercises
            }
        }

        formattedWorkout.exercises = editWorkout.exercises.map(exercise => {
            return {
                id: exercise.info.id,
                workout_id: editWorkout.id,
                exercise_id: exercise.model.id,
                notes: exercise.info.notes,
                order_index: exercise.info.order_index,
                reps: exercise.info.reps,
                rpe: exercise.info.rpe,
                rest_timer: exercise.info.rest_timer,
                distance: exercise.info.distance,
                time: exercise.info.time,
                weight: exercise.info.weight
            }
        })

        // Call Route in update workout mutation, invalidate all queries
        console.log(planId);
        if (planId > 0) {

            editWorkout.name = name;
            editWorkout.notes = notes;

            setEditPlan((prev) => ({
                ...prev,
                workouts: prev.workouts.map(workout =>
                    workout.id === editWorkout.id ? editWorkout : workout
                )    
            }))
        } else {
            console.log("UPDATING WORKOUTS");
            updateWorkoutMutation.mutate({workout: formattedWorkout.workout, exercises: formattedWorkout.exercises, id: editWorkout.id});
        }

    } else if (editMode === "create") {

        // Create workout
        const newWorkout = {
            user_id: user.id,
            notes: notes,
            order_index: editWorkout.order_index,
            name: name
        }

        console.log(planId);
        console.log(editWorkout);
        if (planId && planId !== -1) {

            newWorkout.plan_id = planId
            newWorkout.exercises = [...editWorkout.exercises]

            setEditPlan((prev) => ({
                ...prev,
                workouts: [
                    ...prev.workouts,
                    newWorkout
                ]
            }))
        } else {
            createWorkoutMutation.mutate({newWorkout, workoutExercises: editWorkout.exercises});
        }
        
    }

    stopWorkout()

  };

  const endWorkout = async (name, notes) => {

    // Save to the db
    workoutSession.end_date = (new Date()).toISOString();
    workoutSession.name = name;
    workoutSession.notes = notes;
    const workoutHistoryId = await workoutHistoryMutation.mutateAsync(workoutSession);

    const formattedExerciseSession = exerciseSession.map(exercise => {

        const formattedExercise = {
            exercise_id: exercise.model.id,
            user_workout_id: workoutHistoryId,
            user_id: exercise.info.user_id,
            notes: exercise.info.notes,
            time: exercise.info.time,
            distance: exercise.info.distance,
            date: (new Date()).toISOString().split("T")[0],
            weight: exercise.info.weight,
            reps: exercise.info.reps,
            rpe: exercise.info.rpe,
            order_index: exercise.info.order_index
        };

        return formattedExercise;
    });
    exerciseHistoryMutation.mutate(formattedExerciseSession);

    stopWorkout();
  };

  return (
    <WorkoutContext.Provider
      value={{
        workoutData,
        exerciseSession,
        workoutSession,
        isOpen,
        editMode,
        editWorkout,
        finishedSets,
        startWorkout,
        openForEdit,
        openOffcanvas,
        closeOffcanvas,
        endWorkout,
        saveWorkout,
        stopWorkout,
        setExerciseSession,
        setWorkoutSession,
        setEditWorkout,
        setFinishedSets
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useEditWorkout = () => useContext(WorkoutContext);
