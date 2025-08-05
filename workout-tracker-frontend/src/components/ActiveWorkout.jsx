import { Offcanvas, Button, Table, Container } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useWorkouts } from '../hooks/useWorkoutsData.mjs';

const ActiveWorkout = () => {

    // For handling active workout off canvas
    const {
        workoutData, 
        endWorkout, 
        stopWorkout, 
        closeOffcanvas, 
        isOpen, 
        openOffcanvas, 
        exerciseSession,
        setExerciseSession
    } = useActiveWorkout();

    function updateSet(type, exerciseIndex, index, value) {

        setExerciseSession((prev) => {
            const updated = [...prev]; // shallow copy of the array
            const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

            // Clone the specific array (weight, reps, etc.) to avoid mutating it directly
            const updatedArray = [...updatedExercise[type]];
            updatedArray[index] = value;
            updatedExercise[type] = updatedArray;

            updated[exerciseIndex] = updatedExercise;
            return updated;
        });
    }

    function addSet(exerciseIndex, isCardio) {

        setExerciseSession((prev) => {

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
            updatedExercise.sets++;
    
            updated[exerciseIndex] = updatedExercise;
    
            return updated;

        });

    }

    function removeSet(exerciseIndex, isCardio) {

        setExerciseSession((prev) => {
            
            const updated = [...prev]; // shallow copy of the array
            const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

            if (isCardio) {
                updatedExercise.time.pop();
                updatedExercise.distance.pop();
            } else {
                updatedExercise.weight.pop();
                updatedExercise.reps.pop();
                updatedExercise.rpe.pop();
            }

            updatedExercise.sets--;
    
            updated[exerciseIndex] = updatedExercise;

            return updated

        })

    }

    return (
        <>
        {workoutData && <Button onClick={openOffcanvas}>Resume</Button>}
        {
        workoutData && <Offcanvas show={isOpen} onHide={closeOffcanvas} placement='bottom' style={{height: "90%"}}>
            <Offcanvas.Header className="flex justify-content-between">
                <Offcanvas.Title>{workoutData.name}</Offcanvas.Title>
                <FontAwesomeIcon icon={faChevronDown} onClick={closeOffcanvas}/>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <Button onClick={endWorkout}>Finish Workout</Button>
            {
                exerciseSession && exerciseSession.map((exercise, exerciseIndex) => {
                    return (
                        <div key={exerciseIndex}>
                            <h5>{exercise.name}</h5>
                            <p>{exercise.notes}</p>
                            <Button>Rest Timer: {exercise.rest_timer} Seconds</Button>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>SET</th>
                                        <th>PREVIOUS</th>
                                        {exercise.reps && <th>LBS</th>}
                                        {exercise.reps && <th>REPS</th>}
                                        {exercise.rpe && <th>RPE</th>}
                                        {exercise.time && <th>TIME</th>}
                                        {exercise.distance && <th>DISTANCE</th>}
                                        <th>FINISH</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    exercise.reps && exercise.reps.map((currSet, index) => 
                                        <tr key={index} style={{"overflow": "hidden"}} className="active-workout">
                                            <td>{index + 1}</td>
                                            <td>prev</td>
                                            <td><input type="number" onChange={(e) => updateSet("weight", exerciseIndex, index, e.target.value)} value={exercise.weight[index] || ""}/></td>
                                            <td><input type="number" defaultValue={exercise.reps[index]}/></td>
                                            <td><input type="number" defaultValue={exercise.rpe[index]}/></td>
                                            <td className='text-center'><input type="checkbox"></input></td>
                                            <td><span><FontAwesomeIcon icon={faXmark} onClick={() => removeSet(exerciseIndex, exercise.time ? true : false)}/></span></td>
                                        </tr>
                                    )
                                    }
                                    {
                                    exercise.time && exercise.time.map((currSet, index) =>
                                        <tr key={index} style={{"overflow": "hidden"}} className="active-workout">
                                            <td>{index + 1}</td>
                                            <td>prev</td>
                                            <td><input type="number" defaultValue={exercise.time[index]}/></td>
                                            <td><input type="number" defaultValue={exercise.distance[index]}/></td>
                                            <td className='text-center'><input type="checkbox"></input></td>
                                            <td><span><FontAwesomeIcon icon={faXmark} onChange={() => removeSet(exerciseIndex, exercise.time ? true : false)}/></span></td>
                                        </tr>
                                    )
                                    }
                                </tbody>
                            </Table>
                            <Container className="justify-content-center flex"><Button size="sm" className="w-100" onClick={() => addSet(exerciseIndex, exercise.time ? true : false)}>+ Add Set</Button></Container>
                        </div>
                    )
                })
            }

            <Button onClick={stopWorkout}>Cancel Workout</Button>
            </Offcanvas.Body>
        </Offcanvas>
        }
        </>
    )
}

export default ActiveWorkout