import { Container, Nav, Navbar } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import EditWorkoutOffcanvas from "./EditWorkoutOffcanvas"

const NavigationBar = () => {

  return (
        <Navbar fixed="bottom" className="pb-5 flex-column bg-side-900 border-border-900 border-2">
            <EditWorkoutOffcanvas />
            <Container className="justify-content-center">
                <Nav className="w-full justify-content-evenly">
                    <NavLink 
                        to="/" 
                        className={({isActive}) => 
                            isActive ? '!text-accent-900' : 'nav-link-custom'
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/workouts" 
                        className={({isActive}) => 
                            isActive ? '!text-accent-900' : 'nav-link-custom'
                        }
                    >
                        Workouts
                    </NavLink>
                    <NavLink 
                        to="/profile" 
                        className={({isActive}) => 
                            isActive ? '!text-accent-900' : 'nav-link-custom'
                        }
                    >
                        Profile
                    </NavLink>
                </Nav>
            </Container>
        </Navbar>
  )
}

export default NavigationBar