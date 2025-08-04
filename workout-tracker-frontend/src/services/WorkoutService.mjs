import axiosClient from "./axiosClient.mjs";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getModelWorkoutsByUser = () => {
    return axiosClient.get(BASE_URL + "/workouts");
}

export const getWorkoutHistoryByUser = () => {
    return axiosClient.get(BASE_URL + "/workouts/history")
}