import axiosClient from "./axiosClient.mjs";

export const getExercises = () => {
    return axiosClient.get("/exercises");
}

export const getExerciseHistoryByUser = () => {
    return axiosClient.get("/exercises/history")
}

export const addExerciseHistory = (workoutSession) => {
    return axiosClient.post("/exercises/history", workoutSession);
}