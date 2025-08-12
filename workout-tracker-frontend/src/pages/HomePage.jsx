import { useEffect, useState } from "react"
import { useWorkoutHistory } from "../hooks/useWorkoutsData.mjs";
import { useExerciseHistory } from "../hooks/useExerciseData.mjs";
import { Card } from "../components/Tags";

const HomePage = () => {

    const {data: workoutHistory, isLoading: workoutsLoading, error: workoutsError} = useWorkoutHistory();
    const {data: exerciseHistory, isLoading: exercisesLoading, error: exercisesError} = useExerciseHistory();

  return (
    <div>
        {
        workoutHistory && workoutHistory.map(workout =>
            <Card key={workout.id} bg={"bg-side-900 m-3"}>
                <div className="border-b-1 mb-1">
                    <h5>{workout.name}</h5>
                </div>
                {
                exerciseHistory && exerciseHistory
                    .filter(exercise => workout.id === exercise.user_workout_id)
                    .sort((a, b) => a.date > b.date)
                    .map(exercise => 
                        <div key={workout.id + " " + exercise.id}>{exercise.model.name}</div>
                    )
                }
            </Card>
        )
        }
    </div>
  )
}

export default HomePage