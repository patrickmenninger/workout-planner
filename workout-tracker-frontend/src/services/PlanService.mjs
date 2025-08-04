import axiosClient from "./axiosClient.mjs";

export const getPlansByUser = () => {
    return axiosClient.get("/plans");
}