import { Container, Nav, Navbar } from "react-bootstrap"

const NavigationBar = () => {

  return (
    <Container>
        <Navbar fixed="bottom" className="pb-5">
            <Container className="justify-content-center">
                <Nav className="w-full justify-content-evenly">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/workouts">Workouts</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    </Container>
  )
}

export default NavigationBar