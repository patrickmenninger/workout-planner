import { useEffect, useState } from "react"
import { Card } from "react-bootstrap";
import { getWorkoutHistoryByUser } from "../services/WorkoutService.mjs";
import { getExerciseHistoryByUser } from "../services/ExerciseService.mjs";

const HomePage = () => {

    const [workoutHistory, setWorkoutHistory] = useState();
    const [exerciseHistory, setExerciseHistory] = useState();

    useEffect(() => {
        if (import.meta.env.MODE === "development") {
            // getMockWorkoutHistory();
            // getMockExerciseHistory();
            getWorkoutHistory();
            getExerciseHisotry();
        } else {
            getWorkoutHistory();
            getExerciseHisotry();
        }
    }, []);

    async function getWorkoutHistory() {
        const res = await getWorkoutHistoryByUser();
                
        console.log(res);
        setWorkoutHistory(res.data);
    }

    async function getExerciseHisotry() {
        const res = await getExerciseHistoryByUser();

        console.log(res);
        setExerciseHistory(res.data);
    }

    async function getMockWorkoutHistory() {
        console.log("Mocking Workout History...");
        setWorkoutHistory((await import("../mocks/workout_history.json")).default);
    }

    async function getMockExerciseHistory() {
        console.log("Mocking Exercise History...");
        setExerciseHistory((await import("../mocks/exercise_history.json")).default);
    }

  return (
    <>
        {
        workoutHistory && workoutHistory.map(workout =>
            <Card key={workout.id}>
                <h3>{workout.workout_name}</h3>
                {
                exerciseHistory && exerciseHistory
                    .filter(exercise => workout.id === exercise.user_workout_id)
                    .sort((a, b) => a.date > b.date)
                    .map(exercise => 
                        <h5 key={workout.id + " " + exercise.id}>{exercise.model.name}</h5>
                    )
                }
            </Card>
        )
        }
    </>
  )
}

export default HomePage