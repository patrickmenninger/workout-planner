import { createContext, useContext, useState } from 'react';

const ActiveWorkoutContext = createContext();

export const ActiveWorkoutProvider = ({ children }) => {
  const [workoutData, setWorkoutData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const startWorkout = (workout) => {
    setWorkoutData(workout);
    setIsOpen(true);
  };

  const openOffcanvas = () => setIsOpen(true);
  const closeOffcanvas = () => setIsOpen(false);

  const endWorkout = () => {
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
      }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
};

export const useActiveWorkout = () => useContext(ActiveWorkoutContext);
