import axiosClient from "./axiosClient.mjs";

const BASE_URL = 'http://localhost:3000/api';

export const getWorkoutsByUser = () => {
    return axiosClient.get(BASE_URL + "/workouts");
}