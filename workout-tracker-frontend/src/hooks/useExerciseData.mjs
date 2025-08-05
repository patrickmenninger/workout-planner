import { useQuery } from "@tanstack/react-query";
import { getExerciseHistoryByUser, getExercises } from "../services/ExerciseService.mjs";

export const useExercises = () =>
    useQuery({
        queryKey: ['exercises'],
        queryFn: async() => {
            console.log("Fetching exercises");
            const {data} = await getExercises();
            return data;
        },
        staleTime: 1000 * 60 * 5
});

export const useExerciseHistory = () =>
    useQuery({
        queryKey: ['exercise_history'],
        queryFn: async () => {
            console.log("Fetching exercise history...");
            const { data } = await getExerciseHistoryByUser();
            return data;
        },
        staleTime: 1000 * 60
});