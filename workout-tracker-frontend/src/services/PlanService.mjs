import axiosClient from "./axiosClient.mjs";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getPlansByUser = () => {
    return axiosClient.get("/plans");
}