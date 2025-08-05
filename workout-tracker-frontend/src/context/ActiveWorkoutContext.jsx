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
            exercise_id: exercise.model.id,
            user_workout_id: "",
            user_id: workoutCopy.user_id,
            notes: "",
            time: exercise.info.time ? [...exercise.info.time] : null,
            distance: exercise.info.distance ? [...exercise.info.distance] : null,
            date: (new Date()).toISOString().split("T")[0],
            weight: Array(exercise.info.reps).fill(null),
            reps: exercise.info.reps ? [...exercise.info.reps] : null,
            rpe: exercise.info.rpe ? [...exercise.info.rpe] : null,
            sets: exercise.info.sets,
            rest_timer: exercise.info.rest_timer,
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
    setExerciseSession(null);
  }

  const endWorkout = async () => {

    // Save to the db
    workoutSession.end_date = (new Date()).toISOString();
    const workout_history_id = (await finishWorkout(workoutSession)).data;

    exerciseSession.map(exercise => {
        exercise.user_workout_id = workout_history_id;
        if (exercise.weight.length === 0) {
            exercise.weight = null;
        }
        return exercise;
    });
    (exerciseSession);
    await finishExercises(exerciseSession);

    setWorkoutData(() => null);
    setWorkoutSession(() => null);
    setExerciseSession(() => null);
    setIsOpen(false);
  };

  return (
    <ActiveWorkoutContext.Provider
      value={{
        workoutData,
        exerciseSession,
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
