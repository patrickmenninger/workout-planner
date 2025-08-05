import React from 'react'
import { Offcanvas, Button } from 'react-bootstrap'
import { useState } from 'react';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';

const ActiveWorkout = () => {

    // For handling active workout off canvas
    const {workoutData, endWorkout, stopWorkout, closeOffcanvas, isOpen, openOffcanvas, workoutSession, exerciseSession} = useActiveWorkout();

    return (
        <>
        {workoutData && <Button onClick={openOffcanvas}>Resume</Button>}
        {
        workoutData && <Offcanvas show={isOpen} onHide={closeOffcanvas} placement='bottom' style={{height: "90%"}}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{workoutData.name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <Button onClick={endWorkout}>Finish Workout</Button>
            {
                workoutData && workoutData.exercises.map(exercise => {
                    return (
                        <div key={exercise.info.id}>
                            <div>{exercise.model.name}</div>
                            <div>{JSON.stringify(exercise.info.weight)} {JSON.stringify(exercise.info.reps)} {exercise.info.sets} {exercise.info.distance} {exercise.info.time}</div>
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