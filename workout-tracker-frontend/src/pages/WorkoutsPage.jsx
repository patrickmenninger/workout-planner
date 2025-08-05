import { useEffect } from "react";
import { Card, Tab, Tabs, Button } from "react-bootstrap";

import { useWorkouts } from "../hooks/useWorkoutsData.mjs";
import { usePlans } from "../hooks/usePlansData.mjs";
import Workout from "../components/Workout";
import { NavLink } from "react-router-dom";

const WorkoutsPage = () => {

    const {data: workouts, isLoading: workoutsLoading, error: workoutsError} = useWorkouts();
    const {data: plans, isLoading: plansLoading, error: plansError} = usePlans();

    if (workoutsLoading || plansLoading) return <div>Loading</div>
    if (workoutsError || plansError) return <div>{workoutsError} {plansError}</div>

    return (
        <>
        <Tabs defaultActiveKey="plans" justify>
            <Tab eventKey="plans" title="Plans">
                {
                plans && plans.map(plan =>
                    <Card key={plan.id}>
                        <NavLink to={`/plan/${plan.id}`}>{plan.name}</NavLink>
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