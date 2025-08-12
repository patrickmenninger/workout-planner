import { Container } from 'react-bootstrap'
import { useEditPlan } from '../context/PlanContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import AddWorkout from './AddWorkouts';
import { NavLink } from 'react-router-dom';
import { Button } from './Tags';
import Workout from './Workout';

const EditPlan = ({mode = 'create'}) => {

    const {user} = useAuth();

    const {
        editPlan,
        setEditPlan,
    } = useEditPlan();


    const [workouts, setWorkouts] = useState(editPlan?.workouts || []);
    
    useEffect(() => {
        const source = editPlan?.workouts || [];
        setWorkouts(source);

    }, [editPlan, mode]);

    async function addWorkouts(newWorkouts) {

        let orderIdx = workouts.length;
        const newFormattedWorkouts = newWorkouts.map(workout => {

            workout.order_index = ++orderIdx;

            return workout
            
        });

        const updatedWorkouts = [...workouts, ...newFormattedWorkouts];
        setWorkouts(newFormattedWorkouts);
        
        setEditPlan((prev) => {
            return {
                ...prev,
                workouts: updatedWorkouts,
            }
        });

        console.log("ADDED");

    }

    return (
        <div style={{color: "var(--color-text-primary"}}>
            <Button>Create Workout</Button>
            {
                workouts && workouts.map((workout, workoutIndex) =>
                    <div key={workoutIndex}>
                        <Workout workout={workout} drop="start"/>
                    </div>
                )
            }
            <div className="justify-content-center flex my-3 flex-column gap-3">
                <AddWorkout addWorkouts={addWorkouts}/>
            </div>
        </div>
    )
}

export default EditPlan