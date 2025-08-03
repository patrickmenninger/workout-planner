import { useEffect, useState } from "react";
import { getWorkoutsByUser } from "../services/WorkoutService.mjs";

const WorkoutsPage = () => {

    const [workouts, setWorkouts] = useState();

    useEffect(() => {
        getAllWorkouts();
    }, []);

    async function getAllWorkouts() {
        const res = await getWorkoutsByUser();
        console.log(res);
    }

    return (
        <div>WorkoutsPage</div>
    )
}

export default WorkoutsPage