import { useEffect, useState } from "react";
import { Button, Card, Tab, Tabs } from "react-bootstrap";

import { useWorkouts } from "../hooks/useWorkoutsData.mjs";
import { usePlans } from "../hooks/usePlansData.mjs";
import { useActiveWorkout } from "../context/ActiveWorkoutContext";
import Workout from "../components/Workout";

const WorkoutsPage = () => {

    const {startWorkout} = useActiveWorkout();

    const {data: workouts, isLoading: workoutsLoading, error: workoutsError} = useWorkouts();
    const {data: plans, isLoading: plansLoading, error: plansError} = usePlans();

    // async function getMockWorkouts() {
    //     console.log("Mocking workouts...");
    //     setWorkouts((await import('../mocks/workouts.json')).default);
    // }

    // async function getMockPlans() {
    //     console.log("Mocking plans...");
    //     setPlans((await import('../mocks/plans.json')).default);
    // }

    if (workoutsLoading || plansLoading) return <div>Loading</div>
    if (workoutsError || plansError) return <div>{workoutsError} {plansError}</div>

    return (
        <>
        <Tabs defaultActiveKey="plans" justify>
            <Tab eventKey="plans" title="Plans">
                {
                plans && plans.map(plan =>
                    <Card key={plan.id}>
                        <h5>{plan.name}</h5>
                        {/* {
                            plan.workouts
                                .sort((a, b) => a.order_index - b.order_index)
                                .map(workout => <div key={plan.id + " " + workout.id} className="text-sm">{workout.name}</div>)
                        } */}
                    </Card>
                )
                }
            </Tab>
            <Tab eventKey="workouts" title="Workouts">
                {
                    workouts && workouts.map(workout => 
                        <Workout key={workout.id} workout={workout}/>
                    )
                }
            </Tab>
        </Tabs>
        </>
    )
}

export default WorkoutsPage