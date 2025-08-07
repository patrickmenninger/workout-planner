import { useEffect, useState } from "react"
import { Card } from "react-bootstrap";
import { useWorkoutHistory } from "../hooks/useWorkoutsData.mjs";
import { useExerciseHistory } from "../hooks/useExerciseData.mjs";

const HomePage = () => {

    const {data: workoutHistory, isLoading: workoutsLoading, error: workoutsError} = useWorkoutHistory();
    const {data: exerciseHistory, isLoading: exercisesLoading, error: exercisesError} = useExerciseHistory();

  return (
    <>
        {
        workoutHistory && workoutHistory.map(workout =>
            <Card key={workout.id}>
                <h3>{workout.name}</h3>
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