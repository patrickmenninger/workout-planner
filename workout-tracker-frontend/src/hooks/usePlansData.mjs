import { getPlansByUser, getPlanWorkoutsByUser } from "../services/PlanService.mjs";
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

export const usePlanWorkouts = () =>
    useQuery({
        queryKey: ['plan_workouts'],
        queryFn: async () => {
            console.log("Fetching plan workouts...");
            const { data } = await getPlanWorkoutsByUser();
            return data;
        },
        staleTime: 1000 * 60
    })
