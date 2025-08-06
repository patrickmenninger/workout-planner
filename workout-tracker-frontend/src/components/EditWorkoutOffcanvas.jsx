import { Offcanvas, Button } from 'react-bootstrap'
import { useEditWorkout } from '../context/WorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import EditWorkout from './EditWorkout';
import { useEffect, useState } from 'react';

const EditWorkoutOffcanvas = () => {

    // For handling active workout off canvas
    const {
        workoutData, 
        endWorkout,
        saveWorkout, 
        stopWorkout, 
        closeOffcanvas, 
        isOpen, 
        openOffcanvas,
        editMode,
        editWorkout,
        setEditWorkout,
        setWorkoutSession
    } = useEditWorkout();

    const [title, setTitle] = useState(null);
    const showResume = workoutData || editWorkout;

    useEffect(() => {
        setTitle(editMode === 'in-session' ? workoutData?.name : editWorkout?.name || 'New Workout');
    }, [workoutData, editWorkout])

    function updateTitle(newTitle) {
        setTitle(newTitle);
        if (editMode === "in-session") {
            setWorkoutSession((prev) => ({...prev, workout_name: newTitle}));
        } else {
            setEditWorkout((prev) => ({...prev, name: newTitle}));
        }
    }

    return (
        <>
        {showResume && <Button onClick={openOffcanvas}>Resume</Button>}
        <Offcanvas show={isOpen} onHide={closeOffcanvas} placement='bottom' style={{height: "90%"}}>
            <Offcanvas.Header className="flex justify-content-between">
                <Offcanvas.Title><input type="text" onChange={(e) => updateTitle(e.target.value)} value={title || ""}/></Offcanvas.Title>
                <FontAwesomeIcon icon={faChevronDown} onClick={closeOffcanvas}/>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {editMode === "in-session" && (<Button onClick={endWorkout}>Finish Workout</Button>)}
                {editMode !== 'in-session' && <Button onClick={saveWorkout}>Save Workout</Button>}
                <EditWorkout mode={editMode} initialWorkout={editWorkout}/>
                {editMode === "in-session" && (<Button onClick={stopWorkout}>Cancel Workout</Button>)}
                {editMode !== "in-session" && (<Button onClick={stopWorkout}>Discard</Button>)}
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}

export default EditWorkoutOffcanvas