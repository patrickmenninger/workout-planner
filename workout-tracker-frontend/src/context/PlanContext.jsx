import { createContext, useContext, useState } from 'react';
import { createPlan, addPlanWorkouts } from '../services/PlanService.mjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {

  const queryClient = useQueryClient();

  const [planData, setPlanData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [editMode, setEditMode] = useState(null);

  const openOffcanvas = () => setIsOpen(true);
  const closeOffcanvas = () => setIsOpen(false);

  const createPlanMutation = useMutation({
    mutationFn: async ({newPlan, planWorkouts}) => {
        const id = (await createPlan(newPlan)).data;

        const formattedPlanWorkouts = planWorkouts.map(workout => {
            return {
                plan_id: id,
                workout_id: workout.id,
                order_index: workout.order_index
            };
        });

        await addPlanWorkouts(formattedPlanWorkouts, id);

    },
    onSuccess: () => {
        queryClient.invalidateQueries(["plans"]);
    }
  });

  const openForEdit = (mode, plan) => {
    const planCopy = JSON.parse(JSON.stringify(plan));
    setPlanData(planCopy);

    setEditMode(mode);
    setEditPlan(planCopy);
    setIsOpen(true);
  }


  const stopPlan = () => {
    setPlanData(null);
    setIsOpen(false);
    setEditPlan(null);
    setEditMode(null);
  }

      
  function savePlan(name, notes) {

    if (editMode === "pre-session") {

        const formattedPlan = {
            plan: {
                name: name,
                notes: notes
            }
        }
        formattedPlan.workouts = editPlan.workouts.map(workout => {
            delete workout.exercises;
            return workout;
        })

        console.log(formattedPlan);

        // // Call Route in update workout mutation, invalidate all queries
        // updateWorkoutMutation.mutate({workout: formattedWorkout.workout, exercises: formattedWorkout.exercises, id: editWorkout.id});

    } else if (editMode === "create") {

        const newPlan = {
            user_id: editPlan.workouts[0].user_id,
            name: name,
            notes: notes
        }
        
        createPlanMutation.mutate({newPlan, planWorkouts: editPlan.workouts});
    }

    stopPlan()

  };

  return (
    <PlanContext.Provider
      value={{
        planData,
        isOpen,
        editMode,
        editPlan,
        openForEdit,
        openOffcanvas,
        closeOffcanvas,
        savePlan,
        setEditPlan,
        stopPlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const useEditPlan = () => useContext(PlanContext);
