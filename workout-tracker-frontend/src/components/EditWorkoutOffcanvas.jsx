import { Offcanvas, Button, Container } from 'react-bootstrap'
import { useEditWorkout } from '../context/WorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import EditWorkout from './EditWorkout';
import { useEffect, useState } from 'react';
import ReorderModal from './ReorderModal';

const EditWorkoutOffcanvas = () => {

    function test() {
        console.log(editWorkout);
    }

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
        exerciseSession,
        setEditWorkout,
        setWorkoutSession,
        setExerciseSession
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
                <div className="flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faChevronDown} onClick={closeOffcanvas}/>
                    <Offcanvas.Title><input type="text" onChange={(e) => updateTitle(e.target.value)} value={title || ""}/></Offcanvas.Title>
                </div>
                <div className='flex align-items-center gap-2'>
                    <ReorderModal {...(editMode === "in-session" ? {data: exerciseSession, updateFn: setExerciseSession} : {data: editWorkout, updateFn: setEditWorkout})}/>
                    {editMode !== 'in-session' && <Button onClick={saveWorkout} size="sm">Save</Button>}
                    {editMode === "in-session" && (<Button onClick={endWorkout}>Finish</Button>)}
                </div>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Button onClick={test}>TEST</Button>
                <EditWorkout mode={editMode} initialWorkout={editWorkout}/>
                {editMode === "in-session" && (<Button onClick={stopWorkout}>Cancel Workout</Button>)}
                {editMode !== "in-session" && (<Button onClick={stopWorkout}>Discard</Button>)}
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}

export default EditWorkoutOffcanvas