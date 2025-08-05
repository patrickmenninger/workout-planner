import { createContext, useContext, useState } from 'react';
import { finishWorkout } from '../services/WorkoutService.mjs';
import { finishExercises } from '../services/ExerciseService.mjs';

const ActiveWorkoutContext = createContext();

export const ActiveWorkoutProvider = ({ children }) => {
  const [workoutData, setWorkoutData] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [exerciseSession, setExerciseSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const startWorkout = (workout) => {
    setWorkoutData(workout);

    const currWorkoutSession = {
        user_id: workout.user_id,
        workout_name: workout.name,
        start_date: (new Date()).toISOString()
    }
    setWorkoutSession(currWorkoutSession);

    const currExerciseSession = workout.exercises.map(exercise => {
        return {
            exercise_id: exercise.model.id,
            user_workout_id: "",
            user_id: workout.user_id,
            notes: "",
            time: exercise.info.time,
            distance: exercise.info.distance,
            date: (new Date()).toISOString().split("T")[0],
            weight: [],
            reps: exercise.info.reps,
            rpe: exercise.info.rpe,
            sets: exercise.info.sets,
            order_index: exercise.info.order_index
        }
    });
    setExerciseSession(currExerciseSession);

    setIsOpen(true);
  };

  const openOffcanvas = () => setIsOpen(true);
  const closeOffcanvas = () => setIsOpen(false);

  const stopWorkout = () => {
    setWorkoutData(null);
    setIsOpen(false);
    setWorkoutSession(null);
  }

  const endWorkout = async () => {

    // Save to the db
    workoutSession.end_date = (new Date()).toISOString();
    const workout_history_id = (await finishWorkout(workoutSession)).data;

    exerciseSession.map(exercise => {
        exercise.user_workout_id = workout_history_id;
        return exercise;
    });
    console.log(exerciseSession);
    await finishExercises(exerciseSession);

    setWorkoutData(null);
    setIsOpen(false);
  };

  return (
    <ActiveWorkoutContext.Provider
      value={{
        workoutData,
        isOpen,
        startWorkout,
        openOffcanvas,
        closeOffcanvas,
        endWorkout,
        stopWorkout,
        setExerciseSession
      }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
};

export const useActiveWorkout = () => useContext(ActiveWorkoutContext);
