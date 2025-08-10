import { Modal} from "react-bootstrap"
import { useEffect, useState } from "react";
import { useExercises } from "../hooks/useExerciseData.mjs";
import { Button } from "./Tags";

const AddExercise = ({addExercises}) => {

    const [show, setShow] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    
    const [search, setSearch] = useState("");

    const handleClose = () => {
        setSelectedExercises([]);
        // setExercises(fetchedExercises.map(exercise => ({...exercise, selected: false})));
        setSearch("");
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const {data: fetchedExercises, isLoading: exercisesLoading, error: exercisesError} = useExercises();

    function selectExercise(exercise) {
        setSelectedExercises((prev) => {

            const location = prev.indexOf(exercise);

            if (location === -1) {
                return [...prev, exercise];
            } else {
                prev.splice(location, 1);
                return [...prev];
            }

        });
    }

    function addToWorkout() {
        addExercises(selectedExercises);
        
        handleClose();
    }

    if (exercisesLoading) return <div>Loading</div>
    if (exercisesError) return <div>{exercisesError}</div>

    return (
        <>
            <Button className="w-100 text-center" onClick={handleShow}>
                + Add Exercise
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="bg-main-900 border-0 text-text">
                    <Modal.Title>Add Exercises</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-main-900 text-text">
                    <input type="text" onChange={(e) => setSearch(e.target.value)} value={search || ""} placeholder="Search exercises"/>
                    <div className="overflow-y-scroll h-48">
                        {fetchedExercises && fetchedExercises.filter(exercise => exercise.name.toLowerCase().includes(search.toLowerCase())).map((exercise) => {
                            return <div onClick={() => selectExercise(exercise)} className={"py-2 " + (selectedExercises.find(selectedExercise => selectedExercise.name === exercise.name) ? "border-s-blue-500 border-s-4" : "")} key={exercise.id}>{exercise.name}</div>
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0" style={{backgroundColor: "var(--color-main-900)", color: "var(--color-text)"}}> 
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                    <Button type="go" onClick={addToWorkout}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddExercise