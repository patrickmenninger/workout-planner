import { useEffect, useState, useMemo } from "react";
import { faUpDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from "react-bootstrap";
import { Button } from "./Tags";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ReorderModal = ({mode, data, updateFn, finishedSets = null, setFinishedSets = null, isWorkout = false}) => {

    const sortedItems = useMemo(() => {
        if (data) {
            const sorted = [...data]
                .sort((a, b) => isWorkout ? (a.info.order_index - b.info.order_index) : (a.order_index - b.order_index))
                .filter(item => isWorkout ? (item.info?.order_index != null) : (item?.order_index != null));
            
            // Check for duplicate order_index values
            const orderIndices = sorted.map(item => isWorkout ? item.info.order_index : item.order_index);
            const duplicates = orderIndices.filter((item, index) => orderIndices.indexOf(item) !== index);
            if (duplicates.length > 0) {
                console.warn('Duplicate order_index values found:', duplicates);
                // Reindex to fix duplicates
                return sorted.map((item, i) => {

                    if (isWorkout) {
                        return {
                            ...item,
                            info: { ...item.info, order_index: i + 1 }
                        }
                    } else {
                        return {
                            ...item
                        }
                    }
                });
            }
            return sorted;
        }
        return [];
    }, [data]);

    const [show, setShow] = useState(false);
    const [items, setItems] = useState(sortedItems);
    const [localFinishedSets, setLocalFinishedSets] = useState(isWorkout ? [...finishedSets] : [])

    useEffect(() => {
        setItems(sortedItems);
    }, [sortedItems]);

    useEffect(() => {
        if (isWorkout) {
            setLocalFinishedSets(...finishedSets);
        }
    }, [finishedSets])

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => isWorkout ? (item.info.order_index === active.id) : (item.order_index === active.id));
        const newIndex = items.findIndex((item) => isWorkout ? (item.info.order_index === over.id) : (item.order_index === over.id));

        const newItems = arrayMove(items, oldIndex, newIndex).map((item, i) => {

            if (isWorkout) {
                return {
                    ...item,
                    info: {
                        ...item.info,
                        order_index: i + 1
                    }
                }
            } else {
                return {
                    ...item,
                    order_index: i + 1
                }
            }

        });

        if (isWorkout) {
            const updatedFinishedSets = arrayMove(finishedSets, oldIndex, newIndex);
            
            setLocalFinishedSets(updatedFinishedSets);
        }
        setItems(newItems);
    };

    const handleClose = () => {
        setItems(sortedItems);
        setShow(false);
    }
    const handleShow = () => setShow(true);
    const handleSave = () => {

        if (isWorkout) {
            setFinishedSets(localFinishedSets);
        }

        if (mode === "in-session") {
            updateFn(items)
        } else {

            if (isWorkout) {
                updateFn((prev) => ({
                    ...prev,
                    exercises: items
                }));
            } else {
                updateFn((prev) => ({
                    ...prev,
                    workouts: items
                }))
            }

        }

        handleClose();
    }

  return (
    <>
        <FontAwesomeIcon icon={faUpDown} onClick={handleShow}/>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-main-900 border-0 text-text-primary">
                <Modal.Title>Reorder Exercises</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-main-900 text-text">
                <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((item) => isWorkout ? item.info.order_index : item.order_index)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                        <SortableItem key={isWorkout ? item.info.order_index : item.order_index} item={item} />
                        ))}
                    </SortableContext>
                </DndContext>
            </Modal.Body>
            <Modal.Footer className="border-0" style={{backgroundColor: "var(--color-main-900)", color: "var(--color-text-primary)"}}>
                <Button type="danger" onClick={handleClose}>
                    Discard
                </Button>
                <Button type="go" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
};

const SortableItem = ({ item }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: item.info ? item.info.order_index : item.order_index});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 16,
        marginBottom: 8,
        backgroundColor: 'var(--color-side-900)',
        border: '1px solid #ccc',
        borderRadius: 4,
        cursor: 'grab',
        color: 'var(--color-text-primary)'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <strong>{item.model ? item.model.name : item.name}</strong>
        </div>
    );
};

export default ReorderModal