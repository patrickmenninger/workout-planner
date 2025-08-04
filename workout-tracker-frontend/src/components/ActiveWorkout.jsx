import React from 'react'
import { Offcanvas, Button } from 'react-bootstrap'
import { useState } from 'react';
import { useActiveWorkout } from '../context/ActiveWorkoutContext';

const ActiveWorkout = () => {

    // For handling active workout off canvas
    const {workoutData, endWorkout, closeOffcanvas, isOpen, openOffcanvas} = useActiveWorkout();

    return (
        <>
        {workoutData && <Button onClick={openOffcanvas}>Resume</Button>}
        {
        workoutData && <Offcanvas show={isOpen} onHide={closeOffcanvas} placement='bottom' style={{height: "90%"}}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.

            {JSON.stringify(workoutData)}

            <Button onClick={endWorkout}>Cancel Workout</Button>
            </Offcanvas.Body>
        </Offcanvas>
        }
        </>
    )
}

export default ActiveWorkout