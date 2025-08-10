import { Button, Modal} from "react-bootstrap"
import { useEffect, useState } from "react";
import { useExercises } from "../hooks/useExerciseData.mjs";

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

    // useEffect(() => {
    //     if (fetchedExercises) {
    //         setExercises(fetchedExercises.map(exercise => ({...exercise, selected: false})));
    //     }
    // }, [fetchedExercises]);

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
        // setExercises((prev) => {
        //     const result = prev.map((exercise) => {
        //         return exercise.name === exerciseName
        //             ? {...exercise, selected: !exercise.selected}
        //             : exercise
        //     });
        //     return result;
        // })
    }

    function addToWorkout() {
        addExercises(selectedExercises);
        
        handleClose();
    }

    if (exercisesLoading) return <div>Loading</div>
    if (exercisesError) return <div>{exercisesError}</div>

    return (
        <>
            <Button size="sm" className="w-100" onClick={handleShow}>
                + Add Exercise
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} value={search || ""} placeholder="Search exercises"/>
                    <div className="overflow-y-scroll h-48">
                        {fetchedExercises && fetchedExercises.filter(exercise => exercise.name.toLowerCase().includes(search.toLowerCase())).map((exercise) => {
                            return <div onClick={() => selectExercise(exercise)} className={"py-2 " + (selectedExercises.find(selectedExercise => selectedExercise.name === exercise.name) ? "border-s-blue-500 border-s-4" : "")} key={exercise.id}>{exercise.name}</div>
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addToWorkout}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddExercise