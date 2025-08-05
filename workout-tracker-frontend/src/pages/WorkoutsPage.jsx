import { Card, Tab, Tabs, Button } from "react-bootstrap";

import { useWorkouts } from "../hooks/useWorkoutsData.mjs";
import { usePlans } from "../hooks/usePlansData.mjs";
import Workout from "../components/Workout";
import { NavLink } from "react-router-dom";
import { useActiveWorkout } from "../context/ActiveWorkoutContext";

const WorkoutsPage = () => {

    const {data: workouts, isLoading: workoutsLoading, error: workoutsError} = useWorkouts();
    const {data: plans, isLoading: plansLoading, error: plansError} = usePlans();
    const {openForEdit} = useActiveWorkout();

    const handleEditWorkout = (workout) => {
        console.log("EDITING");
        openForEdit('pre-session', workout);
    };

    const handleCreateWorkout = () => {
        console.log("CREATING");
        openForEdit('create', { name: 'New Workout', exercises: [] });
    };

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
                        <div  key={workout.id}>
                            <Workout workout={workout}/>
                            <Button onClick={() => handleEditWorkout(workout)}>Edit</Button>
                        </div>
                    )
                }
                <Button onClick={handleCreateWorkout}>Create Workout</Button>
            </Tab>
        </Tabs>
        </>
    )
}

export default WorkoutsPage