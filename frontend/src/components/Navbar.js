import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

 function AppNavbar() {
   return (
     <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
       <Container>
         {/* El 'as={Link}' es clave para que funcione con React Router */}
         <Navbar.Brand as={Link} to="/">Ferretería Online</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
         <Nav className="me-auto">
         <Nav.Link as={Link} to="/">Inicio</Nav.Link>
         <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
         <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
             {/* Puedes añadir el enlace a productos aquí cuando crees la página */}
            {/* <Nav.Link as={Link} to="/productos">Productos</Nav.Link> */}
         </Nav>
         </Navbar.Collapse>
         </Container>
        </Navbar>
      );
    }
    
    export default AppNavbar;
