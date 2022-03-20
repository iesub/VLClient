import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import '../css/Header.css'

const Header = () =>(
<header>
    <Navbar className="Header" variant = "dark" expand="lg">
    <Container>
        <Navbar.Brand href="#home">
            Книжная полка
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
        <LinkContainer to = "/">
            <Nav.Link className = "NavLink">На главную</Nav.Link>
        </LinkContainer>
        </Nav>
        </Navbar.Collapse>
    </Container>
    </Navbar>
</header>
);

export default Header;