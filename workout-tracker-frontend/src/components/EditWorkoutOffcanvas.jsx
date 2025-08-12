import { Offcanvas, Container } from 'react-bootstrap'
import { useEditWorkout } from '../context/WorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import EditWorkout from './EditWorkout';
import { useEffect, useState } from 'react';
import ReorderModal from './ReorderModal';
import { Button } from './Tags';

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
        workoutSession,
        exerciseSession,
        finishedSets,
        setEditWorkout,
        setWorkoutSession,
        setExerciseSession,
        setFinishedSets
    } = useEditWorkout();

    const [title, setTitle] = useState(null);
    const [notes, setNotes] = useState(null);
    const showResume = workoutData;

    useEffect(() => {
        setTitle(editMode === 'in-session' ? workoutSession?.name : workoutData?.name || 'New Workout');
        setNotes(editMode === 'in-session' ? workoutSession?.notes : workoutData?.notes || "");
    }, [workoutData]);

    function updateTitle(newTitle) {
        setTitle(newTitle);
    }

    function updateNotes(newNotes) {
        setNotes(newNotes);
    }

    return (
        <>
        {showResume && <Button type="go" className="my-2" onClick={openOffcanvas}>Resume</Button>}
        <Offcanvas show={isOpen} onHide={closeOffcanvas} placement='bottom' style={{height: "90%", color: "var(--color-text-primary)"}}>
            <Offcanvas.Header className="flex flex-col gap-4 bg-main-900">
                <div className="flex justify-content-between w-100">
                    <div className="flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faChevronDown} onClick={closeOffcanvas}/>
                        <Offcanvas.Title><input type="text" onChange={(e) => updateTitle(e.target.value)} value={title || ""}/></Offcanvas.Title>
                    </div>
                    <div className='flex align-items-center gap-2'>
                        <ReorderModal 
                            {...(editMode === "in-session" 
                                ? {mode: "in-session", data: exerciseSession, updateFn: setExerciseSession} 
                                : {mode: "not-in-session", data: editWorkout.exercises, updateFn: setEditWorkout}
                            )} 
                            finishedSets={finishedSets} 
                            setFinishedSets={setFinishedSets}
                            isWorkout
                        />
                        {editMode !== 'in-session' && (<Button onClick={() => saveWorkout(title, notes)}>Save</Button>)}
                        {editMode === "in-session" && (<Button onClick={() => endWorkout(title, notes)} type="go">Finish</Button>)}
                    </div>
                </div>
                <div className="w-100">
                    <textarea value={notes || ""} onChange={(e) => updateNotes(e.target.value)} className="justify-self-start w-100 text-text-secondary" placeholder="Workout notes"/>
                </div>
            </Offcanvas.Header>
            <Offcanvas.Body className="bg-main-900 flex flex-col">
                <EditWorkout mode={editMode} initialWorkout={workoutData}/>
                {editMode === "in-session" && (<Button type="danger" onClick={stopWorkout}>Cancel Workout</Button>)}
                {editMode !== "in-session" && (<Button type="danger" onClick={stopWorkout}>Discard</Button>)}
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}

export default EditWorkoutOffcanvas