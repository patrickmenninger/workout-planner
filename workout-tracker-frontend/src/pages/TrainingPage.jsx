import { Tab, Tabs, Modal } from "react-bootstrap";
import { useState } from "react";
import { useWorkouts } from "../hooks/useWorkoutsData.mjs";
import { usePlans } from "../hooks/usePlansData.mjs";
import Workout from "../components/Workout";
import { NavLink } from "react-router-dom";
import { useEditWorkout } from "../context/WorkoutContext";
import {Card, Button} from "../components/Tags"
import { useEditPlan } from "../context/PlanContext";
import Plan from "../components/Plan";

const TrainingPage = () => {

    const {data: workouts, isLoading: workoutsLoading, error: workoutsError} = useWorkouts();
    const {data: plans, isLoading: plansLoading, error: plansError} = usePlans();
    const {openForEdit: openWorkoutForEdit, startWorkout} = useEditWorkout();
    const {openForEdit: openPlanForEdit} = useEditPlan();

    const handleCreateWorkout = () => {
        console.log("CREATING");
        openWorkoutForEdit('create', { name: 'New Workout', notes: "", exercises: [] });
    };

    const handleCreatePlan = () => {
        console.log("CREATING PLAN");
        openPlanForEdit('create', { name: 'New Plan', notes: "", workouts: [] });
    }

    if (workoutsLoading || plansLoading) return <div>Loading</div>
    if (workoutsError || plansError) return <div>{workoutsError} {plansError}</div>

    return (
        <>
        <Tabs defaultActiveKey="plans" justify className="bg-side-900">
            <Tab eventKey="plans" title="Plans">
                <Button onClick={test}>Test</Button>
                <div className="my-3 flex justify-content-center">
                    <Button onClick={handleCreatePlan} className="w-50">Create Plan</Button>
                </div>
                <h1 className="m-3">Plans</h1>
                {
                    plans && plans.map(plan =>
                        <div key={plan.id}>
                            <Plan plan={plan} drop={"end"}/>
                        </div>
                    )
                }
            </Tab>
            <Tab eventKey="workouts" title="Workouts" className="bg-main-900">
                <div className="flex flex-col align-items-center my-3 gap-3">
                    <Button onClick={() => startWorkout({name: "New Workout", exercises: []})} className="w-50">Quick Start Workout</Button>
                    <Button onClick={handleCreateWorkout} className="w-50">Create Workout</Button>
                </div>
                <h1 className="m-3">Workouts</h1>
                {
                    workouts && workouts.map(workout => 
                        <div  key={workout.id}>
                            <Workout workout={workout} drop="end"/>
                        </div>
                    )
                }
            </Tab>
        </Tabs>
        </>
    )
}

export default TrainingPage