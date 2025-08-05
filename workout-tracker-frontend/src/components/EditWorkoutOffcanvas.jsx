import { Offcanvas, Button } from 'react-bootstrap'
import { useActiveWorkout } from '../context/ActiveWorkoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import EditWorkout from './EditWorkout';

const EditWorkoutOffcanvas = () => {

    // For handling active workout off canvas
    const {
        workoutData, 
        endWorkout, 
        stopWorkout, 
        closeOffcanvas, 
        isOpen, 
        openOffcanvas,
        editMode,
        editWorkout
    } = useActiveWorkout();

    
    function handleSave() {
        stopWorkout();
        if (editMode === "pre-session") {
            console.log("SAVING");
        } else if (editMode === "create") {
            console.log("CREATING NEW");
        }
    };

    const title = editMode === 'in-session' ? workoutData?.name : editWorkout?.name || 'New Workout';
    const showResume = workoutData || editWorkout;

    return (
        <>
        {showResume && <Button onClick={openOffcanvas}>Resume</Button>}
        <Offcanvas show={isOpen} onHide={closeOffcanvas} placement='bottom' style={{height: "90%"}}>
            <Offcanvas.Header className="flex justify-content-between">
                <Offcanvas.Title>{title}</Offcanvas.Title>
                <FontAwesomeIcon icon={faChevronDown} onClick={closeOffcanvas}/>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {editMode === "in-session" && (<Button onClick={endWorkout}>Finish Workout</Button>)}
                {editMode !== 'in-session' && <Button onClick={handleSave}>Save Workout</Button>}
                <EditWorkout mode={editMode} initialWorkout={editWorkout}/>
                {editMode === "in-session" && (<Button onClick={stopWorkout}>Cancel Workout</Button>)}
                {editMode !== "in-session" && (<Button onClick={stopWorkout}>Discard Workout</Button>)}
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}

export default EditWorkoutOffcanvas