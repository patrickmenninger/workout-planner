import axiosClient from "./axiosClient.mjs";

export const getExerciseHistoryByUser = () => {
    return axiosClient.get("/exercises/history")
}

export const finishExercises = (workoutSession) => {
    return axiosClient.post("/exercises/history", workoutSession);
}