import axiosClient from "./axiosClient.mjs";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getExerciseHistoryByUser = () => {
    return axiosClient.get("/exercises/history")
}