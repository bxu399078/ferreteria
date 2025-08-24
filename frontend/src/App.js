import React from 'react';
import Clientes from './components/Clientes';
import Productos from './components/Productos';
import Presentacion from './components/Presentacion';
import Container from 'react-bootstrap/Container';
import { Routes, Route } from 'react-router-dom';

import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClientesPage from './pages/ClientesPage';
import ProductosPage from './pages/ProductosPage';
import ComprasPage from './pages/ComprasPage';

function App() {
  return (
    /*{<div className="App">
      <header className="App-header">
        <h1>Ferretería</h1>
      </header>
      <main>
        <Clientes />
        <Productos />
        <Presentacion/>
      </main>
    </div> }*/
    <div>
       {/* 1. El menú siempre estará visible */}
       <AppNavbar/>
 
       {/* 2. Un contenedor para que el contenido de la página esté centrado */}
       <Container>
         {/* 3. Aquí se decide qué página mostrar */}
         <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/clientes" element={<ClientesPage />} />
           <Route path="/productos" element={<ProductosPage />} />
           <Route path="/compras" element={<ComprasPage />} />
           {/* Cuando crees la página de productos, la añadirás aquí: */}
           {/* <Route path="/productos" element={<ProductosPage />} /> */}
          </Routes>
          
        </Container>
 
     </div>
 
  
  
  );
}

export default App;