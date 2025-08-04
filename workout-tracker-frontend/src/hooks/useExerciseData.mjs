import { useQuery } from "@tanstack/react-query";
import { getExerciseHistoryByUser } from "../services/ExerciseService.mjs";

export const useExerciseHistory = () =>
    useQuery({
        queryKey: ['exercise-history'],
        queryFn: async () => {
            console.log("Fetching exercise history...");
            const { data } = await getExerciseHistoryByUser();
            return data;
        },
        staleTime: 1000 * 60
});