import { Dropdown } from "react-bootstrap"
import { useEditWorkout } from "../context/WorkoutContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteWorkout } from "../services/WorkoutService.mjs";
import { Card, Button } from "./Tags";
import { useWorkouts } from "../hooks/useWorkoutsData.mjs";

const Workout = ({workout, drop}) => {

    const queryClient = useQueryClient();

    const {data: listOfWorkouts, isLoading: workoutsLoading, error: workoutsError} = useWorkouts();

    const [currWorkout, setCurrWorkout] = useState(workout);

    useEffect(() => {
        if (!workout.exercises) {
            setCurrWorkout(listOfWorkouts.find(currWorkout => currWorkout.id === workout.id));
        }
    }, [listOfWorkouts, workout])

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

    if (workoutsLoading) return <div>Loading</div>
    if (workoutsError) return <div>{workoutsError}</div>

    return (
        <>
        <Card key={workout.id}>
            <div className="flex justify-content-between align-items-center border-b-[1px] mb-1">
                <h5>{workout.name}</h5>
                <Dropdown className="bg-side" drop={drop}>
                    <Dropdown.Toggle id="dropdown-basic"> 
                        <FontAwesomeIcon icon={faBars}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="bg-side flex">
                        <Dropdown.Item><Button onClick={() => handleDeleteWorkout()} type="danger">Delete</Button></Dropdown.Item>
                        <Dropdown.Item><Button onClick={() => handleEditWorkout(workout)}>Edit</Button></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
                <div>
                    <div className="flex justify-content-between">
                        <span className="font-bold">Exercises</span>
                        <span className="font-bold">Sets</span>
                    </div>
                    {
                    currWorkout.exercises && currWorkout.exercises
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
                    <div className="flex justify-content-center">
                        <Button onClick={() => startWorkout(workout)} className="mx-auto w-100 mt-3">Start Workout</Button>
                    </div>
                </div>
        </Card>
        </>
    )
}

export default Workout