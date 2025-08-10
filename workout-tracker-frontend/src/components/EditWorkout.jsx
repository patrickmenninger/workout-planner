import { Button, Table, Container } from 'react-bootstrap'
import { useEditWorkout } from '../context/WorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import AddExercise from './AddExercise';
import { NavLink } from 'react-router-dom';

const EditWorkout = ({mode = 'in-session'}) => {

    const {user} = useAuth();

    const {
        exerciseSession,
        setExerciseSession,
        editWorkout,
        setEditWorkout,
    } = useEditWorkout();

    const [exercises, setExercises] = useState(
        mode === 'in-session' ? exerciseSession : editWorkout.exercises || []
    );
    
    useEffect(() => {
        const source = mode === 'in-session' ? exerciseSession : editWorkout.exercises || [];
        setExercises(source);

    }, [exerciseSession, editWorkout, mode]);

    function updateSet(type, exerciseIndex, index, value) {

        const updated = [...exercises]; // shallow copy of the array
        const updatedExerciseInfo = { ...updated[exerciseIndex].info }; // copy the exercise object

        // Clone the specific array (weight, reps, etc.) to avoid mutating it directly
        const updatedArray = [...updatedExerciseInfo[type]];
        updatedArray[index] = value;
        updatedExerciseInfo[type] = updatedArray;
        updated[exerciseIndex].info = updatedExerciseInfo;


        if (mode === 'in-session') {
            setExerciseSession(updated);
        } else {
            setExercises(updated);
        }

        console.log(updated);

    }

    function addSet(exerciseIndex, isCardio) {

        const updated = [...exercises]; // shallow copy of the array
        const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

        if (isCardio) {
            updatedExercise.info.time.push(updatedExercise.info.time[updatedExercise.info.time.length - 1] || 0);
            updatedExercise.info.distance.push(updatedExercise.info.distance[updatedExercise.info.distance.length - 1] || 0);
        } else {
            updatedExercise.info.weight.push(updatedExercise.info.weight[updatedExercise.info.weight.length - 1] || 0);
            updatedExercise.info.reps.push(updatedExercise.info.reps[updatedExercise.info.reps.length - 1] || 0);
            updatedExercise.info.rpe.push(updatedExercise.info.rpe[updatedExercise.info.rpe.length - 1] || 0);
        }
        updatedExercise.info.sets = (updatedExercise.info.sets || 0) + 1;
        updated[exerciseIndex] = updatedExercise;


        if (mode === 'in-session') {
            setExerciseSession(updated);
        } else {
            setExercises(updated);
        }

        console.log(updated);

    }

    function removeSet(exerciseIndex, isCardio, index) {

        const updated = [...exercises]; // shallow copy of the array
        const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

        if (isCardio) {
            updatedExercise.info.time?.splice(index, 1) || [];
            updatedExercise.info.distance?.splice(index, 1) || [];
        } else {
            updatedExercise.info.weight?.splice(index, 1) || [];
            updatedExercise.info.reps?.splice(index, 1) || [];
            updatedExercise.info.rpe?.splice(index, 1) || [];
        }
        updatedExercise.info.sets = Math.max((updatedExercise.info.sets || 0) - 1, 0);
        updated[exerciseIndex] = updatedExercise;

        if (mode === 'in-session') {
            setExerciseSession(updated);
        } else {
            setEditWorkout((prev) => {
                return {
                    ...prev,
                    exercises: updated
                }
            });
        }

    }

    async function updateExercise(exerciseIndex, newNotes) {
        
        const updated = [...exercises]; // shallow copy of the array
        const updatedExercise = { ...updated[exerciseIndex] }; // copy the exercise object

        updatedExercise.info.notes = newNotes;
        updated[exerciseIndex] = updatedExercise;

        if (mode === 'in-session') {
            setExerciseSession(updated);
        } else {
            setEditWorkout((prev) => {
                return {
                    ...prev,
                    exercises: updated
                }
            });
        }

    }

    async function addExercises(newExercises) {

        let orderIdx = exercises.length;
        const newFormattedExercises = newExercises.map(exercise => {

            if (exercise.muscle_groups.includes("Cardio")) {
                return {
                    model: {
                        name: exercise.name,
                        id: exercise.id,
                    },
                    info: {
                        user_id: user.id,
                        notes: "",
                        time: [null],
                        distance: [null],
                        weight: null,
                        reps: null,
                        rpe: null,
                        rest_timer: 60,
                        order_index: ++orderIdx,
                    }
                }
            } else {
                return {
                    model: {
                        name: exercise.name,
                        id: exercise.id,
                    },
                    info: {
                        user_id: user.id,
                        notes: "",
                        time: null,
                        distance: null,
                        weight: [null],
                        reps: [null],
                        rpe: [null],
                        rest_timer: 60,
                        order_index: ++orderIdx,
                    }
                }
            }

            
        });

        const updatedWorkout = [...exercises, ...newFormattedExercises];
        setExercises(updatedWorkout);

        if (mode === 'in-session') {
            setExerciseSession(updatedWorkout);
        } else {
            setEditWorkout((prev) => {
                return {
                    ...prev,
                    exercises: updatedWorkout,
                }
            });
        }

    }

    async function removeExercise(exerciseIndex) {

        const updatedWorkout = [...exercises];
        updatedWorkout.splice(exerciseIndex, 1);

        // Reassign order_index to keep them sequential
        const reindexedWorkout = updatedWorkout.map((exercise, i) => ({
            ...exercise,
            info: {
                ...exercise.info,
                order_index: i + 1
            }
        }));

        setExercises(reindexedWorkout);

        if (mode === 'in-session') {
            setExerciseSession(reindexedWorkout);
        } else {
            setEditWorkout((prev) => {
                return {
                    ...prev,
                    exercises: reindexedWorkout,
                }
            });
        }

    }

    return (
        <>
            {
                exercises && exercises.map((exercise, exerciseIndex) => {
                    return (
                        <div key={exerciseIndex}>
                            <div className='flex justify-content-between align-items-center'>
                                <NavLink to={`/exercises/${exercise.model.id}`}>{exercise.model.name}</NavLink>
                                <FontAwesomeIcon icon={faXmark} onClick={() => removeExercise(exerciseIndex)}/>
                            </div>
                            <textarea value={exercise.info.notes || ""} onChange={(e) => updateExercise(exerciseIndex, e.target.value)} placeholder='Exercise notes'/>
                            <Button>Rest Timer: {exercise.info.rest_timer} Seconds</Button>
                            <div className="table-container mx-auto">
                                <div className="table-row">
                                    <div className="table-cell">SET</div>
                                    <div className="table-cell">PREVIOUS</div>
                                    {exercise.info.reps && <div className="table-cell">LBS</div>}
                                    {exercise.info.reps && <div className="table-cell">REPS</div>}
                                    {exercise.info.rpe && <div className="table-cell">RPE</div>}
                                    {exercise.info.time && <div className="table-cell">TIME</div>}
                                    {exercise.info.distance && <div className="table-cell">DISTANCE</div>}
                                    {mode === 'in-session' && (<div className="table-cell">FINISH</div>)}
                                </div>
                                {
                                exercise.info.reps && exercise.info.reps.map((currSet, index) => 
                                    <div key={index} style={{"overflow": "hidden"}} className="table-row">
                                        <div className="table-cell">{index + 1}</div>
                                        <div className="table-cell">prev</div>
                                        <div className="table-cell"><input type="number" onChange={(e) => updateSet("weight", exerciseIndex, index, e.target.value)} value={exercise.info.weight[index] || ""}/></div>
                                        <div className="table-cell"><input type="number" onChange={(e) => updateSet("reps", exerciseIndex, index, e.target.value)} value={exercise.info.reps[index] || ""}/></div>
                                        <div className="table-cell"><input type="number" onChange={(e) => updateSet("rpe", exerciseIndex, index, e.target.value)} value={exercise.info.rpe[index] || ""}/></div>
                                        {mode === "in-session" && (<div className='text-center table-cell'><input type="checkbox"></input></div>)}
                                        <div className="table-cell"><span><FontAwesomeIcon icon={faXmark} onClick={() => removeSet(exerciseIndex, exercise.info.time ? true : false, index)}/></span></div>
                                    </div>
                                )
                                }
                                {
                                exercise.info.time && exercise.info.time.map((currSet, index) =>
                                    <div key={index} style={{"overflow": "hidden"}} className="table-row">
                                        <div className="table-cell">{index + 1}</div>
                                        <div className="table-cell">prev</div>
                                        <div className="table-cell"><input type="number" onChange={(e) => updateSet("time", exerciseIndex, index, e.target.value)} value={exercise.info.time[index] || ""}/></div>
                                        <div className="table-cell"><input type="number" onChange={(e) => updateSet("distance", exerciseIndex, index, e.target.value)} value={exercise.info.distance[index] || ""}/></div>
                                        {mode === "in-session" && (<div className='text-center table-cell'><input type="checkbox"></input></div>)}
                                        <div className="table-cell"><span><FontAwesomeIcon icon={faXmark} onClick={() => removeSet(exerciseIndex, exercise.info.time ? true : false, index)}/></span></div>
                                    </div>
                                )
                                }
                            </div>
                            <Container className="justify-content-center flex"><Button size="sm" className="w-100" onClick={() => addSet(exerciseIndex, exercise.info.time ? true : false)}>+ Add Set</Button></Container>
                        </div>
                    )
                })
            }
            <Container className="justify-content-center flex">
                <AddExercise addExercises={addExercises}/>
            </Container>
        </>
    )
}

export default EditWorkout