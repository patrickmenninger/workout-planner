import axiosClient from "./axiosClient.mjs";

export const getModelWorkoutsByUser = () => {
    return axiosClient.get("/workouts");
}

export const getWorkoutHistoryByUser = () => {
    return axiosClient.get("/workouts/history");
}

export const addWorkoutHistory = (workoutSession) => {
    return axiosClient.post("/workouts/history", workoutSession);
}

export const updateWorkout = (updatedWorkout, id) => {    
    return axiosClient.put(`/workouts/${id}`, updatedWorkout)
}

export const createWorkout = (newWorkout) => {
    return axiosClient.post("/workouts", newWorkout);
}

export const addWorkoutExercises = (workoutExercises, id) => {
    return axiosClient.post(`/workouts/${id}/exercises`, workoutExercises)
}

export const deleteWorkout = (id) => {
    return axiosClient.delete(`/workouts/${id}`)
}