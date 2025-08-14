import { createContext, useContext, useState } from 'react';
import { createPlan, updatePlan, updatePlanWorkout } from '../services/PlanService.mjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthProvider';

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {

  const queryClient = useQueryClient();

  const {user} = useAuth();

  const [planData, setPlanData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [editMode, setEditMode] = useState(null);

  const openOffcanvas = () => setIsOpen(true);
  const closeOffcanvas = () => setIsOpen(false);

  const createPlanMutation = useMutation({
    mutationFn: async ({newPlan, planWorkouts}) => {
        await createPlan(newPlan);
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["plans"]);
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({updatedPlan, updatedWorkouts, id}) => {

        const insertedWorkouts = (
            await updatePlan({
                plan: updatedPlan, 
                workouts: updatedWorkouts.map(({exercises, ...rest}) => rest)
            }, id)
        ).data

        console.log("INSERTED", insertedWorkouts);
        console.log("UPDATED", updatedWorkouts);

        await Promise.all(updatedWorkouts.map(async workout => {

            if (!workout.id) {
                workout.id = insertedWorkouts.find(insWorkout => insWorkout.order_index === workout.order_index).id;
            }

            const {exercises, ...workoutWithoutExercises} = workout;

            const formattedExercises = exercises.map(exercise => {
                return {
                    id: exercise.info.id,
                    workout_id: workout.id,
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

            console.log(formattedExercises);
            await updatePlanWorkout({workout: workoutWithoutExercises, exercises: formattedExercises}, id, workout.id);
        }))

    },
    onSuccess: () => {
        queryClient.invalidateQueries(["plans"]),
        queryClient.invalidateQueries(["plan_workouts"])
    }
  })

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
                notes: notes,
                user_id: editPlan.user_id,
                id: editPlan.id
            }
        }
        
        formattedPlan.workouts = editPlan.workouts.map((workout) => {

            return {
                name: workout.name,
                notes: workout.notes,
                order_index: workout.order_index,
                plan_id: editPlan.id,
                user_id: user.id,
                id: workout.id,
                exercises: workout.exercises
            };

        });

        console.log(formattedPlan);

        updatePlanMutation.mutate({updatedPlan: formattedPlan.plan, updatedWorkouts: formattedPlan.workouts, id: editPlan.id});

    } else if (editMode === "create") {

        const newPlan = {
            user_id: user.id,
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
