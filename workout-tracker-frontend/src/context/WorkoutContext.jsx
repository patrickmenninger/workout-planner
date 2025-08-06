import { createContext, useContext, useState } from 'react';
import { addWorkoutExercises, createWorkout, finishWorkout, updateWorkout } from '../services/WorkoutService.mjs';
import { finishExercises } from '../services/ExerciseService.mjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {

  const queryClient = useQueryClient();

  const [workoutData, setWorkoutData] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [exerciseSession, setExerciseSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState('in-session');
  const [editWorkout, setEditWorkout] = useState(null);

  const workoutHistoryMutation = useMutation({
    mutationFn: async (newWorkoutHistory) => {
        const id = (await finishWorkout(newWorkoutHistory)).data;
        return id;
    },
    onSuccess: () => {
        queryClient.invalidateQueries(['workout_history']);
    }
  });

  
  const exerciseHistoryMutation = useMutation({
    mutationFn: async (newExerciseHistory) => {
        await finishExercises(newExerciseHistory);
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
                exercise_id: exercise.model.exercise_id,
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
        workout_name: workoutCopy.name,
        start_date: (new Date()).toISOString()
    }
    setWorkoutSession(currWorkoutSession);

    const currExerciseSession = workoutCopy.exercises.map(exercise => {

        return {
            model: {
                name: exercise.model.name,
                exercise_id: exercise.model.id,
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
    setExerciseSession(currExerciseSession);
    setEditMode('in-session');
    setEditWorkout(null);
    setIsOpen(true);
  };

  const openForEdit = (mode, workout) => {
    setEditMode(mode);
    setEditWorkout(workout);
    setIsOpen(true);
  }

  const openOffcanvas = () => setIsOpen(true);
  const closeOffcanvas = () => setIsOpen(false);

  const stopWorkout = () => {
    setWorkoutData(null);
    setIsOpen(false);
    setWorkoutSession(null);
    setExerciseSession(null);
    setEditMode('in-session');
    setEditWorkout(null);
  }

      
  function saveWorkout() {
    if (editMode === "pre-session") {

        const formattedWorkout = {
            workout: {
                name: editWorkout.name,
                notes: editWorkout.notes
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
        updateWorkoutMutation.mutate({workout: formattedWorkout.workout, exercises: formattedWorkout.exercises, id: editWorkout.id});

    } else if (editMode === "create") {

        // Create workout
        console.log(editWorkout);
        const newWorkout = {
            user_id: editWorkout.exercises[0].info.user_id,
            notes: editWorkout.notes,
            name: editWorkout.name,
        }
        
        createWorkoutMutation.mutate({newWorkout, workoutExercises: editWorkout.exercises});
    }

    stopWorkout()

  };

  const endWorkout = async () => {

    // Save to the db
    console.log(workoutSession);
    workoutSession.end_date = (new Date()).toISOString();
    const workoutHistoryId = await workoutHistoryMutation.mutateAsync(workoutSession);

    const formattedExerciseSession = exerciseSession.map(exercise => {

        const formattedExercise = {
            exercise_id: exercise.model.exercise_id,
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
        isOpen,
        editMode,
        editWorkout,
        startWorkout,
        openForEdit,
        openOffcanvas,
        closeOffcanvas,
        endWorkout,
        saveWorkout,
        stopWorkout,
        setExerciseSession,
        setWorkoutSession,
        setEditWorkout
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useEditWorkout = () => useContext(WorkoutContext);
