import { useEffect, useState, useMemo } from "react";
import { faUpDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Button } from "react-bootstrap";
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
import { useEditWorkout } from "../context/WorkoutContext";

const ReorderModal = ({mode, data, updateFn}) => {

    const sortedItems = useMemo(() => {
        if (data) {
            const sorted = [...data]
                .sort((a, b) => a.info.order_index - b.info.order_index)
                .filter(item => item.info?.order_index != null);
            
            // Check for duplicate order_index values
            const orderIndices = sorted.map(item => item.info.order_index);
            const duplicates = orderIndices.filter((item, index) => orderIndices.indexOf(item) !== index);
            if (duplicates.length > 0) {
                console.warn('Duplicate order_index values found:', duplicates);
                // Reindex to fix duplicates
                return sorted.map((item, i) => ({
                    ...item,
                    info: { ...item.info, order_index: i + 1 }
                }));
            }
            return sorted;
        }
        return [];
    }, [data]);

    const [show, setShow] = useState(false);
    const [items, setItems] = useState(sortedItems);

    useEffect(() => {
        setItems(sortedItems);
    }, [sortedItems]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.info.order_index === active.id);
        const newIndex = items.findIndex((item) => item.info.order_index === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex).map((item, i) => ({
            ...item,
            info: {
                ...item.info,
                order_index: i + 1
            }
        }));

        setItems(newItems);
    };

    const handleClose = () => {
        setItems(sortedItems);
        setShow(false);
    }
    const handleShow = () => setShow(true);
    const handleSave = () => {

        if (mode === "in-session") {
            updateFn(items)
        } else {
            updateFn((prev) => ({
                ...prev,
                exercises: items
            }));
        }

        handleClose();
    }

  return (
    <>
        <FontAwesomeIcon icon={faUpDown} onClick={handleShow}/>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((item) => item.info.order_index)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                        <SortableItem key={item.info.order_index} item={item} />
                        ))}
                    </SortableContext>
                </DndContext>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
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
    } = useSortable({ id: item.info.order_index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 16,
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: 4,
        cursor: 'grab'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <strong>{item.model.name}</strong> — Order: {item.info.order_index}
        </div>
    );
};

export default ReorderModal