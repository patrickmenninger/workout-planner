import axiosClient from "./axiosClient.mjs";

const BASE_URL = 'http://localhost:3000/api';

export const getModelWorkoutsByUser = () => {
    return axiosClient.get(BASE_URL + "/workouts");
}