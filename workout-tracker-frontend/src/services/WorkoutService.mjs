import axiosClient from "./axiosClient.mjs";

export const getModelWorkoutsByUser = () => {
    return axiosClient.get("/workouts");
}

export const getWorkoutHistoryByUser = () => {
    return axiosClient.get("/workouts/history");
}

export const finishWorkout = (workoutSession) => {
    return axiosClient.post("/workouts/history", workoutSession);
}