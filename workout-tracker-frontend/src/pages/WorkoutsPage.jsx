import { Tab, Tabs, Modal } from "react-bootstrap";
import { useState } from "react";
import { useWorkouts } from "../hooks/useWorkoutsData.mjs";
import { usePlans } from "../hooks/usePlansData.mjs";
import Workout from "../components/Workout";
import { NavLink } from "react-router-dom";
import { useEditWorkout } from "../context/WorkoutContext";
import {Card, Button} from "../components/Tags"

const WorkoutsPage = () => {

    const {data: workouts, isLoading: workoutsLoading, error: workoutsError} = useWorkouts();
    const {data: plans, isLoading: plansLoading, error: plansError} = usePlans();
    const {openForEdit, startWorkout} = useEditWorkout();

    const handleCreateWorkout = () => {
        console.log("CREATING");
        openForEdit('create', { name: 'New Workout', notes: "", exercises: [] });
    };

    if (workoutsLoading || plansLoading) return <div>Loading</div>
    if (workoutsError || plansError) return <div>{workoutsError} {plansError}</div>

    return (
        <>
        <Tabs defaultActiveKey="plans" justify className="bg-side-900">
            <Tab eventKey="plans" title="Plans">
                {
                plans && plans.map(plan =>
                    <Card key={plan.id}>
                        <NavLink to={`/plans/${plan.id}`}>{plan.name}</NavLink>
                    </Card>
                )
                }
            </Tab>
            <Tab eventKey="workouts" title="Workouts" className="bg-main-900">
                <Button onClick={() => startWorkout({name: "New Workout", exercises: []})} className="w-50 mx-auto my-3">Quick Start Workout</Button>
                <Button onClick={handleCreateWorkout} className="w-50 mx-auto my-3">Create Workout</Button>
                {
                    workouts && workouts.map(workout => 
                        <div  key={workout.id}>
                            <Workout workout={workout}/>
                        </div>
                    )
                }
            </Tab>
        </Tabs>
        </>
    )
}

export default WorkoutsPage