import axiosClient from "./axiosClient.mjs";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getModelWorkoutsByUser = () => {
    return axiosClient.get("/workouts");
}

export const getWorkoutHistoryByUser = () => {
    return axiosClient.get("/workouts/history")
}