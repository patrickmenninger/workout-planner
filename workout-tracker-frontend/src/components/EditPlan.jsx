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
import { useEditWorkout } from '../context/WorkoutContext';

const EditPlan = ({mode = 'create'}) => {

    const {
        editPlan,
        setEditPlan
    } = useEditPlan();

    const {openForEdit} = useEditWorkout();


    const [workouts, setWorkouts] = useState(() => editPlan?.workouts ? editPlan.workouts : []);

    useEffect(() => {
        setWorkouts(editPlan?.workouts ? editPlan.workouts : []);
    }, [editPlan?.workouts, mode]);

    const handleCreateWorkout = () => {
        openForEdit('create', { name: 'New Workout', notes: "", exercises: [], order_index: (workouts.length + 1) }, editPlan.id);
    };


    async function addWorkouts(newWorkouts) {

        let orderIdx = workouts.length;
        const newFormattedWorkouts = newWorkouts.map(workout => {

            workout.order_index = ++orderIdx;
            delete workout.id;

            return workout;
            
        });

        const updatedWorkouts = [...workouts, ...newFormattedWorkouts];
        setWorkouts(updatedWorkouts);
        
        setEditPlan((prev) => {
            return {
                ...prev,
                workouts: updatedWorkouts,
            }
        });

    }

    function test(){
        console.log(editPlan);
    }

    return (
        <div style={{color: "var(--color-text-primary"}}>
            <Button onClick={test}>TEST</Button>
            <Button onClick={handleCreateWorkout}>Create Workout</Button>
            {
                workouts && workouts.sort((a, b) => a.order_index - b.order_index).map((workout, workoutIndex) =>
                    <div key={workoutIndex}>
                        <Workout workout={workout} drop="start" planId={workout.plan_id ? workout.plan_id : -1}/>
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