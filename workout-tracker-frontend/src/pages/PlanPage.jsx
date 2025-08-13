import { usePlans, usePlanWorkouts } from "../hooks/usePlansData.mjs";
import { useWorkouts } from "../hooks/useWorkoutsData.mjs";
import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Workout from "../components/Workout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from "../components/Tags";

const PlanPage = () => {

    const {id} = useParams();
    const {data: plans, isLoading: plansLoading, error: plansError} = usePlans();
    const {data: workouts, isLoading: workoutsLoading, error: workoutsError} = usePlanWorkouts();

    const currPlan = plans?.find((plan) => String(plan.id) === id);

    if (plansLoading || workoutsLoading) return <div>Loading</div>
    if (plansError || workoutsError) return <div>{plansError} {workoutsError}</div>
    if (!currPlan) return <div>Plan not found</div>;

    return (
        <>
            <div className="flex justify-between m-2">
                <NavLink to="/training" className="flex items-center justify-center w-8 h-8 self-center">
                    <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                </NavLink>
                <h1>{currPlan.name}</h1>
                <div> </div>
            </div>
            {
                currPlan?.workouts.sort((a, b) => a.order_index - b.order_index).map(currWorkout => {

                    if (!currWorkout || !currWorkout.id) return null;

                    const currWorkoutInfo = workouts.find(workout => workout.id === currWorkout.id);

                    return <Workout key={currWorkout.id} workout={currWorkoutInfo} drop="end" planId={-1}/>
                })
            }
        </>
    )
}

export default PlanPage