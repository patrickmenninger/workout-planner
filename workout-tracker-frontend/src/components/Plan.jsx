import { Card, Button } from "./Tags"
import { NavLink } from "react-router-dom"
import { Dropdown } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEditPlan } from "../context/PlanContext";
import { deletePlan } from "../services/PlanService.mjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Plan = ({plan, drop}) => {

    const queryClient = useQueryClient();

    const {openForEdit} = useEditPlan();

    const deletePlanMutation = useMutation({
        mutationFn: async (id) => {
            await deletePlan(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['plans']);
        }
    });
    const handleDeletePlan = () => {
        deletePlanMutation.mutate(plan.id);
    }

    function handleEditPlan() {
        openForEdit("pre-session", plan)
    }

  return (
        <Card key={plan.id}>
            <div className="flex justify-between">
                <NavLink to={`/plans/${plan.id}`}>{plan.name}</NavLink>
                <Dropdown className="bg-side" drop={drop}>
                    <Dropdown.Toggle id="dropdown-basic"> 
                        <FontAwesomeIcon icon={faBars}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="bg-side flex">
                        <Dropdown.Item><Button onClick={() => handleDeletePlan()} type="danger">Delete</Button></Dropdown.Item>
                        <Dropdown.Item><Button onClick={() => handleEditPlan(plan)}>Edit</Button></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Card>
  )
}

export default Plan