import axiosClient from "./axiosClient.mjs";

export const getPlansByUser = () => {
    return axiosClient.get("/plans");
}

export const createPlan = (plan) => {
    return axiosClient.post("/plans", plan);
}

export const addPlanWorkouts = (planWorkouts, id) => {
    return axiosClient.post(`/plans/${id}/workouts`, planWorkouts)
}

export const deletePlan = (id) => {
    return axiosClient.delete(`/plans/${id}`);
}