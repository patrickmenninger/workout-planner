import {NavLink} from 'react-router-dom'
import { Tab, Tabs, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useExercises } from '../hooks/useExerciseData.mjs';
import { useExerciseHistory } from '../hooks/useExerciseData.mjs';
import { useWorkoutHistory } from '../hooks/useWorkoutsData.mjs'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExerciseHistory from '../components/ExerciseHistory';

const ExercisePage = () => {

    const {data: exercises, isLoading: exercisesLoading, error: exercisesError} = useExercises();
    const {data: exercisesHistory, isLoading: exercisesHistoryLoading, error: exercisesHistoryError} = useExerciseHistory();
    const {data: workoutsHistory, isLoading: workoutHistoryLoading, error: workoutHistoryError} = useWorkoutHistory();

    const [currExercise, setCurrExercise] = useState(null);
    const [currExerciseHistory, setCurrExerciseHistory] = useState([])

    const {id} = useParams();

    useEffect(() => {
        if (exercises && id) {
            const foundExercise = exercises.find((exercise) => String(exercise.id) === id);
            setCurrExercise(foundExercise || null);
        }
    }, [exercises, id]);

    useEffect(() => {
        if (exercisesHistory) {
            setCurrExerciseHistory(exercisesHistory.filter(exercise => exercise.exercise_id == id));
            console.log(exercisesHistory)
        }
    }, [exercisesHistory]);

    function test() {
        console.log(workoutsHistory);
        console.log(currExerciseHistory);
    }
    
    if (exercisesLoading || exercisesHistoryLoading) return <div>Loading</div>
    if (exercisesHistoryError || exercisesError) return <div>{exercisesHistoryError} {exercisesError}</div>
    if (!currExercise) return <div>Exercise not found</div>;

  return (
    <>
        <div className="flex justify-content-between">
            <NavLink to="/workouts"><FontAwesomeIcon icon={faArrowLeft}/></NavLink>
            <h3>{currExercise.name}</h3>
            <div> </div>
        </div>
        <Tabs defaultActiveKey="history" justify className='bg-side-900'>
            <Tab eventKey="history" title="History">
                {
                    currExerciseHistory.length !== 0 ? (
                        workoutsHistory && currExerciseHistory.map((history, index) => {
                            return <ExerciseHistory 
                                key={history.id}
                                exerciseName={currExercise.name}
                                isCardio={currExercise.muscle_groups.includes("Cardio")}
                                exerciseHistory={history} 
                                workoutInfo={workoutsHistory.find(workout => workout.id === currExerciseHistory[index].user_workout_id)}
                            />
                        })
                    ) : (
                        <div>No exercise history</div>
                    )
                }
            </Tab>
            <Tab eventKey="other" title="Other">

            </Tab>
        </Tabs>
    </>
  )
}

export default ExercisePage