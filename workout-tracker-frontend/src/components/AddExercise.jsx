import { Button, Modal} from "react-bootstrap"
import { useEffect, useState } from "react";
import { useExercises } from "../hooks/useExerciseData.mjs";

const AddExercise = ({addExercises}) => {

    const [show, setShow] = useState(false);
    const [exercises, setExercises] = useState([]);

    const handleClose = () => {
        setExercises(fetchedExercises.map(exercise => ({...exercise, selected: false})));
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const {data: fetchedExercises, isLoading: exercisesLoading, error: exercisesError} = useExercises();

    useEffect(() => {
        if (fetchedExercises) {
            setExercises(fetchedExercises.map(exercise => ({...exercise, selected: false})));
        }
    }, [fetchedExercises])

    function selectExercise(exerciseName) {
        setExercises((prev) => {
            const result = prev.map((exercise) => {
                return exercise.name === exerciseName
                    ? {...exercise, selected: !exercise.selected}
                    : exercise
            });
            return result;
        })
    }

    function addToWorkout() {
        const formattedExercises = exercises.filter(exercise => exercise.selected);
        
        addExercises(formattedExercises);
        
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
                    {exercises && exercises.map((exercise) => {
                        return <div onClick={() => selectExercise(exercise.name)} className={exercise.selected ? "border-s-blue-500 border-s-4" : ""} key={exercise.id}>{exercise.name}</div>
                    })}
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