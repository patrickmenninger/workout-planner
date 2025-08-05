import { Container, Nav, Navbar } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import ActiveWorkout from "./ActiveWorkout"

const NavigationBar = () => {

  return (
    <Container className="bg-white">
        <Navbar fixed="bottom" className="pb-5 flex-column">
            <ActiveWorkout />
            <Container className="justify-content-center">
                <Nav className="w-full justify-content-evenly">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/workouts">Workouts</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                </Nav>
            </Container>
        </Navbar>
    </Container>
  )
}

export default NavigationBar