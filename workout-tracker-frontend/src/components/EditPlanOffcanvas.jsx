import { Offcanvas, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import EditPlan from './EditPlan';
import { useEffect, useState } from 'react';
import ReorderModal from './ReorderModal';
import { Button } from './Tags';
import { useEditPlan } from '../context/PlanContext';
import { useEditWorkout } from '../context/WorkoutContext';

const EditPlanOffcanvas = () => {

    // For handling active plan off canvas
    const {
        planData, 
        savePlan, 
        stopPlan,
        closeOffcanvas, 
        isOpen, 
        openOffcanvas,
        editMode,
        editPlan,
        setEditPlan,
    } = useEditPlan();

    const {stopWorkout} = useEditWorkout();

    const [title, setTitle] = useState(null);
    const [notes, setNotes] = useState(null);
    const showResume = planData;

    useEffect(() => {
        setTitle(planData?.name || 'New Workout');
        setNotes(planData?.notes || "");
    }, [planData]);

    function updateTitle(newTitle) {
        setTitle(newTitle);
    }

    function updateNotes(newNotes) {
        setNotes(newNotes);
    }

    function handleClose() {
        closeOffcanvas();
        stopPlan();
        stopWorkout();
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
                        {editPlan && <ReorderModal 
                            {...({mode: editMode, data: editPlan.workouts, updateFn: setEditPlan})} 
                        />}
                        <Button onClick={() => savePlan(title, notes)}>Save</Button>
                    </div>
                </div>
                <div className="w-100">
                    <textarea value={notes || ""} onChange={(e) => updateNotes(e.target.value)} className="justify-self-start w-100 text-text-secondary" placeholder="Plan notes"/>
                </div>
            </Offcanvas.Header>
            <Offcanvas.Body className="bg-main-900 flex flex-col">
                <EditPlan initialPlan={planData}/>
                <Button type="danger" onClick={handleClose}>Discard</Button>
            </Offcanvas.Body>
        </Offcanvas>
        </>
    )
}

export default EditPlanOffcanvas