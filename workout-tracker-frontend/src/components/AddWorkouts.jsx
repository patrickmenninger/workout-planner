import { Modal} from "react-bootstrap"
import { useEffect, useState } from "react";
import { useWorkouts } from "../hooks/useWorkoutsData.mjs";
import { Button } from "./Tags";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const AddWorkout = ({addWorkouts}) => {

    const [show, setShow] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);
    
    const [search, setSearch] = useState("");

    const handleClose = () => {
        setSelectedWorkouts([]);
        setSearch("");
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const {data: fetchedWorkouts, isLoading: workoutsLoading, error: workoutsError} = useWorkouts();

    function selectWorkout(workout) {
        setSelectedWorkouts((prev) => {

            const location = prev.indexOf(workout);

            if (location === -1) {
                return [...prev, workout];
            } else {
                prev.splice(location, 1);
                return [...prev];
            }

        });
    }

    function addToWorkout() {
        addWorkouts(selectedWorkouts);
        
        handleClose();
    }

    function clearSearch() {
        setSearch("");
    }

    if (workoutsLoading) return <div>Loading</div>
    if (workoutsError) return <div>{workoutsError}</div>

    return (
        <>
            <Button className="w-100 text-center" onClick={handleShow}>
                + Add workout
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="bg-main-900 border-0 text-text-primary">
                    <Modal.Title>Add Workouts</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-main-900 text-text">
                    <div>
                        <input type="text" className="text-text-secondary" onChange={(e) => setSearch(e.target.value)} value={search || ""} placeholder="Search workouts"/>
                        <FontAwesomeIcon icon={faXmark} onClick={clearSearch}/>
                    </div>
                    <div className="overflow-y-scroll h-48">
                        {fetchedWorkouts && fetchedWorkouts.filter(workout => workout.name.toLowerCase().includes(search.toLowerCase())).map((workout) => {
                            return <div onClick={() => selectWorkout(workout)} className={"py-2 text-text-primary " + (selectedWorkouts.find(selectedWorkout => selectedWorkout.name === workout.name) ? "border-s-accent-900 border-s-4" : "")} key={workout.id}>{workout.name}</div>
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0" style={{backgroundColor: "var(--color-main-900)", color: "var(--color-text-primary)"}}> 
                    <Button type="danger" onClick={handleClose}>
                        Close
                    </Button>
                    <Button type="go" onClick={addToWorkout}>
                        Add Workouts
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddWorkout