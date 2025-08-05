import { getModelWorkoutsByUser, getWorkoutHistoryByUser } from "../services/WorkoutService.mjs";
import { useQuery } from "@tanstack/react-query";

export const useWorkouts = () =>
    useQuery({
        queryKey: ['workouts'],
        queryFn: async () => {
            console.log("Fetching workouts...");
            const { data } = await getModelWorkoutsByUser();
            return data;
        },
        staleTime: 1000 * 60
});

export const useWorkoutHistory = () =>
    useQuery({
        queryKey: ['workout_history'],
        queryFn: async () => {
            console.log("Fetching workout history...");
            const { data } = await getWorkoutHistoryByUser();
            return data;
        },
        staleTime: 1000 * 60
});
