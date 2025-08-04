import axiosClient from "./axiosClient.mjs";

export const getExerciseHistoryByUser = () => {
    return axiosClient.get("/exercises/history")
}