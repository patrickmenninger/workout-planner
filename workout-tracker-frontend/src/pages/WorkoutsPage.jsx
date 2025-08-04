import { useEffect, useState } from "react";
import { getModelWorkoutsByUser } from "../services/WorkoutService.mjs";
import { getPlansByUser } from "../services/PlanService.mjs";
import { Card, Tab, Tabs } from "react-bootstrap";

const WorkoutsPage = () => {

    const [workouts, setWorkouts] = useState();
    const [plans, setPlans] = useState();

    useEffect(() => {

        if (import.meta.env.MODE === 'development') {
            // getMockWorkouts();
            // getMockPlans();
            getAllModelWorkouts();
            getAllPlans();
        } else {
            getAllModelWorkouts();
            getAllPlans();
        }
    }, []);

    async function getMockWorkouts() {
        console.log("Mocking workouts...");
        setWorkouts((await import('../mocks/workouts.json')).default);
    }

    async function getMockPlans() {
        console.log("Mocking plans...");
        setPlans((await import('../mocks/plans.json')).default);
    }

    async function getAllModelWorkouts() {
        const res = await getModelWorkoutsByUser();
        
        console.log(res);
        setWorkouts(res.data);
    }

    async function getAllPlans() {
        const res = await getPlansByUser();

        console.log(res);
        setPlans(res.data);
    }

    return (
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
                    <Card key={workout.id}>
                        <h5>{workout.name}</h5>
                        {
                            workout.exercises
                                .sort((a, b) => a.exercise.order_index - b.exercise.order_index)
                                .map(exercise => <div key={workout.id + " " + exercise.exercise.id} className="text-sm">{exercise.model.name} {exercise.exercise.reps} {exercise.exercise.sets} {exercise.exercise.distance}</div>)
                        }
                    </Card>
                )
                }
            </Tab>
        </Tabs>
        // <>
        //     <h1>
        //         Plans
        //         
        //     </h1>
        //     <h1>
        //         Workouts
        //         
        //     </h1>
        // </>
    )
}

export default WorkoutsPage