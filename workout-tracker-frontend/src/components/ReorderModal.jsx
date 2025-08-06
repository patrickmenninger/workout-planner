import { useEffect, useState } from "react";
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

const ReorderModal = ({data, updateFn}) => {

    const [show, setShow] = useState(false);
    const [items, setItems] = useState(
        data?.exercises?.sort((a, b) => a.info.order_index - b.info.order_index) || []
    );

    useEffect(() => {
        setItems(data?.exercises?.sort((a, b) => a.info.order_index - b.info.order_index) || []);
    }, [data]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.info.id === active.id);
        const newIndex = items.findIndex((item) => item.info.id === over.id);

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
        setItems(data?.exercises?.sort((a, b) => a.info.order_index - b.info.order_index));
        setShow(false);
    }
    const handleShow = () => setShow(true);
    const handleSave = () => {
        updateFn((prev) => ({
            ...prev,
            exercises: items
        }));
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
                        items={items.map((item) => item.info.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                        <SortableItem key={item.info.id} item={item} />
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
    } = useSortable({ id: item.info.id });

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