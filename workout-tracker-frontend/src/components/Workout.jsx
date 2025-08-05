import { Card, Button } from "react-bootstrap"
import { useActiveWorkout } from "../context/ActiveWorkoutContext"

const Workout = ({workout}) => {

    const {startWorkout} = useActiveWorkout();

    return (
        <Card key={workout.id} className="my-3 py-3 px-2">
            <h5>{workout.name}</h5>
                <Card className="px-3">
                    <div className="flex justify-content-between">
                        <span>Exercises</span>
                        <span>Sets</span>
                    </div>
                    {
                    workout.exercises
                        .sort((a, b) => a.info.order_index - b.info.order_index)
                        .map(exercise => {

                            return (
                                <div key={workout.id + " " + exercise.info.id} className="flex justify-content-between">
                                    <span className={exercise.info.time && exercise.info.distance ? "self-center" : ""}>{exercise.model.name}</span>
                                    <div>
                                        {exercise.info.reps && <span>Sets: {exercise.info.reps.length}</span>}
                                        {exercise.info.time && <span>Sets: {exercise.info.time.length}</span>}
                                    </div>
                                </div>
                            )

                        })
                    }
                <Button onClick={() => startWorkout(workout)}>Start Workout</Button>
                </Card>
        </Card>
    )
}

export default Workout