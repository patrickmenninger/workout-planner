import { getPlansByUser } from "../services/PlanService.mjs";
import { getModelWorkoutsByUser } from "../services/WorkoutService.mjs";
import { useQuery } from "@tanstack/react-query";

export const usePlans = () =>
    useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            console.log("Fetching plans...");
            const { data } = await getPlansByUser();
            return data;
        },
        staleTime: 1000 * 60
    });
