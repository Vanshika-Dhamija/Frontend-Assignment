import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BasicExample() {
  return (
    <div style= {{"color": "white" }} className="text-white">
        <Navbar expand="lg" style= {{"color": "white" }} className="bg-secondary">
        <Container className="text-white">
            <Navbar.Brand>Assignment-VanshikaDhamija</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="">Sample1</Nav.Link>
                <Nav.Link href="">Sample1</Nav.Link>
                
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </div>
  );
}

export default BasicExample;