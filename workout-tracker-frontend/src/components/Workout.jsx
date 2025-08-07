import { Card, Button, Dropdown } from "react-bootstrap"
import { useEditWorkout } from "../context/WorkoutContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteWorkout } from "../services/WorkoutService.mjs";

const Workout = ({workout}) => {

    const queryClient = useQueryClient();

    const handleEditWorkout = (workout) => {
        openForEdit('pre-session', workout);
    };

    const deleteWorkoutMutation = useMutation({
        mutationFn: async (id) => {
            await deleteWorkout(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['workouts']);
        }
    })
    const handleDeleteWorkout = () => {
        deleteWorkoutMutation.mutate(workout.id);
    }

    const {startWorkout, openForEdit} = useEditWorkout();

    return (
        <>
        <Card key={workout.id} className="my-3 py-3 px-2">
            <div className="flex justify-content-between align-items-center">
                <h5>{workout.name}</h5>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <FontAwesomeIcon icon={faBars}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item><Button onClick={() => handleEditWorkout(workout)}>Edit</Button></Dropdown.Item>
                        <Dropdown.Item><Button className="btn-danger" onClick={() => handleDeleteWorkout()}>Delete</Button></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
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
        </>
    )
}

export default Workout