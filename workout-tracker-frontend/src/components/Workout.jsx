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
                                        {exercise.info.sets && <span>Sets: {exercise.info.sets}</span>}
                                        <div>
                                            {exercise.info.time && <div>Time: {(exercise.info.time) / 60} Minutes</div>}
                                            {exercise.info.distance && <div>Distance: {exercise.info.distance} Miles</div>}
                                        </div>
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