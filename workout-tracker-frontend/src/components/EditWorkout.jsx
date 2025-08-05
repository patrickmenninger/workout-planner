import { Button, Table, Container } from 'react-bootstrap'
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const EditWorkout = ({mode = 'in-session', initialWorkout = null}) => {

    // For handling active workout off canvas
    const {
        exerciseSession,
        setExerciseSession
    } = useActiveWorkout();

    const [workout, setWorkout] = useState(
        mode === 'in-session' ? exerciseSession : initialWorkout?.exercises || []
    );

    function updateSet(type, exerciseIndex, index, value) {

        const updated = [...workout]; // shallow copy of the array
        const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

        // Clone the specific array (weight, reps, etc.) to avoid mutating it directly
        const updatedArray = [...updatedExercise[type]];
        updatedArray[index] = value;
        updatedExercise[type] = updatedArray;
        updated[exerciseIndex] = updatedExercise;

        if (mode === 'in-session') {
            setExerciseSession(updated);
        } else {
            setWorkout(updated);
        }

    }

    function addSet(exerciseIndex, isCardio) {

        const updated = [...prev]; // shallow copy of the array
        const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

        if (isCardio) {
            updatedExercise.time.push(updatedExercise.time[updatedExercise.time.length - 1]);
            updatedExercise.distance.push(updatedExercise.distance[updatedExercise.distance.length - 1]);
        } else {
            updatedExercise.weight.push(updatedExercise.weight[updatedExercise.weight.length - 1]);
            updatedExercise.reps.push(updatedExercise.reps[updatedExercise.reps.length - 1]);
            updatedExercise.rpe.push(updatedExercise.rpe[updatedExercise.rpe.length - 1]);
        }
        updatedExercise.sets = (updatedExercise.sets || 0) + 1;
        updated[exerciseIndex] = updatedExercise;


        if (mode === 'in-session') {
            setExerciseSession(updated);
        } else {
            setWorkout(updated);
        }


    }

    function removeSet(exerciseIndex, isCardio) {

        const updated = [...prev]; // shallow copy of the array
        const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

        if (isCardio) {
            updatedExercise.time = updatedExercise.time?.slice(0, -1) || [];
            updatedExercise.distance = updatedExercise.distance?.slice(0, -1) || [];
        } else {
            updatedExercise.weight = updatedExercise.weight?.slice(0, -1) || [];
            updatedExercise.reps = updatedExercise.reps?.slice(0, -1) || [];
            updatedExercise.rpe = updatedExercise.rpe?.slice(0, -1) || [];
        }
        updatedExercise.sets = Math.max((updatedExercise.sets || 0) - 1, 0);
        updated[exerciseIndex] = updatedExercise;

        if (mode === 'in-session') {
            setExerciseSession(updated);
        } else {
            setWorkout(updated);
        }

    }

    function addExercise(exercise) {
        const newExercise = {
            exercise_id: exercise.id,
            name: exercise.name,
            notes: "",
            time: exercise.muscle_group.includes("Cardio") ? [] : null,
            distance: exercise.muscle_group.includes("Cardio") ? [] : null,
            weight: !exercise.muscle_group.includes("Cardio") ? [] : null,
            reps: !exercise.muscle_group.includes("Cardio") ? [] : null,
            rpe: !exercise.muscle_group.includes("Cardio") ? [] : null,
            sets: 0,
            rest_timer: 0,
            order_index: workout.length
        };

        setWorkout([...workout, newExercise]);
    }

    return (
        <>
            {
                workout && workout.map((exercise, exerciseIndex) => {
                    return (
                        <div key={exerciseIndex}>
                            <h5>{exercise.model.name}</h5>
                            <p>{exercise.info.notes}</p>
                            <Button>Rest Timer: {exercise.info.rest_timer} Seconds</Button>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>SET</th>
                                        <th>PREVIOUS</th>
                                        {exercise.info.reps && <th>LBS</th>}
                                        {exercise.info.reps && <th>REPS</th>}
                                        {exercise.info.rpe && <th>RPE</th>}
                                        {exercise.info.time && <th>TIME</th>}
                                        {exercise.info.distance && <th>DISTANCE</th>}
                                        {mode === 'in-session' && (<th>FINISH</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    exercise.info.reps && exercise.info.reps.map((currSet, index) => 
                                        <tr key={index} style={{"overflow": "hidden"}} className="active-workout">
                                            <td>{index + 1}</td>
                                            <td>prev</td>
                                            <td><input type="number" onChange={(e) => updateSet("weight", exerciseIndex, index, e.target.value)} value={exercise.info.weight?.[index] || ""}/></td>
                                            <td><input type="number" defaultValue={exercise.info.reps[index]}/></td>
                                            <td><input type="number" defaultValue={exercise.info.rpe[index]}/></td>
                                            {mode === "in-session" && (<td className='text-center'><input type="checkbox"></input></td>)}
                                            <td><span><FontAwesomeIcon icon={faXmark} onClick={() => removeSet(exerciseIndex, exercise.info.time ? true : false)}/></span></td>
                                        </tr>
                                    )
                                    }
                                    {
                                    exercise.info.time && exercise.info.time.map((currSet, index) =>
                                        <tr key={index} style={{"overflow": "hidden"}} className="active-workout">
                                            <td>{index + 1}</td>
                                            <td>prev</td>
                                            <td><input type="number" defaultValue={exercise.info.time[index]}/></td>
                                            <td><input type="number" defaultValue={exercise.info.distance[index]}/></td>
                                            {mode === "in-session" && (<td className='text-center'><input type="checkbox"></input></td>)}
                                            <td><span><FontAwesomeIcon icon={faXmark} onChange={() => removeSet(exerciseIndex, exercise.info.time ? true : false)}/></span></td>
                                        </tr>
                                    )
                                    }
                                </tbody>
                            </Table>
                            <Container className="justify-content-center flex"><Button size="sm" className="w-100" onClick={() => addSet(exerciseIndex, exercise.info.time ? true : false)}>+ Add Set</Button></Container>
                        </div>
                    )
                })
            }
            <Container className="justify-content-center flex">
                <Button size="sm" className="w-100" onClick={addExercise}>
                + Add Exercise
                </Button>
            </Container>
        </>
    )
}

export default EditWorkout