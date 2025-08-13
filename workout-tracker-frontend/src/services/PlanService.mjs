import axiosClient from "./axiosClient.mjs";

export const getPlansByUser = () => {
    return axiosClient.get("/plans");
}

export const updatePlan = (updatedPlan, planId) => {
    return axiosClient.put(`/plans/${planId}`, updatedPlan);
}

export const getPlanWorkoutsByUser = () => {
    return axiosClient.get("/plans/workouts");
}

export const updatePlanWorkout = (updatedWorkout, planId, workoutId) => {
    return axiosClient.put(`/plans/${planId}/workouts/${workoutId}`, updatedWorkout)
}

export const createPlan = (plan) => {
    return axiosClient.post("/plans", plan);
}

export const createPlanWorkout = (newWorkout, planId) => {
    return axiosClient.post(`/plans/${planId}/workouts`, newWorkout)
}

export const deletePlan = (id) => {
    return axiosClient.delete(`/plans/${id}`);
}