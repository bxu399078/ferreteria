import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Card, Alert } from 'react-bootstrap';
 
 function ComprasPage() {
   // --- ESTADOS ---
   const [clientes, setClientes] = useState([]);
   const [productos, setProductos] = useState([]);
   const [compra, setCompra] = useState({
     cliente_id: '',
     producto_id: '',
     cantidad: 1
   });
   const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
 
   // --- EFECTO PARA CARGAR CLIENTES Y PRODUCTOS ---
   useEffect(() => {
     // Cargar clientes
     axios.get(`${process.env.REACT_APP_API_URL}/api/clientes`)
       .then(res => setClientes(res.data))
       .catch(err => console.error("Error cargando clientes:", err));
 
     // Cargar productos
     axios.get(`${process.env.REACT_APP_API_URL}/api/productos`)
       .then(res => setProductos(res.data))
       .catch(err => console.error("Error cargando productos:", err));
   }, []);
 
   // --- MANEJADORES DE FORMULARIO ---
   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setCompra({ ...compra, [name]: value });
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setStatusMessage({ type: '', message: '' }); // Limpiar mensaje anterior
 
     if (!compra.cliente_id || !compra.producto_id) {
       setStatusMessage({ type: 'danger', message: 'Por favor, selecciona un cliente y un producto.' });
       return;
     }
 
     try {
       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/compras`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(compra),
       });
 
       if (response.ok) {
         setStatusMessage({ type: 'success', message: '¡Compra registrada con éxito!' });
         // Resetear formulario
         setCompra({ cliente_id: '', producto_id: '', cantidad: 1 });
       } else {
         const errorData = await response.json();
         throw new Error(errorData.message || 'No se pudo registrar la compra.');
       }
     } catch (error) {
       setStatusMessage({ type: 'danger', message: error.message });
     }
   };
 
   return (
     <Card className="card-transparent">
       <Card.Body>
         <Card.Title as="h2">Registrar Nueva Compra</Card.Title>
         <Form onSubmit={handleSubmit}>
           {/* Selector de Cliente */}
           <Form.Group className="mb-3">
             <Form.Label>Cliente</Form.Label>
             <Form.Select name="cliente_id" value={compra.cliente_id} onChange={handleInputChange} required>
               <option value="">Selecciona un cliente...</option>
               {clientes.map(cliente => (
                 <option key={cliente.id} value={cliente.id}>
                   {cliente.nombre}
                 </option>
               ))}
             </Form.Select>
           </Form.Group>
 
           {/* Selector de Producto */}
           <Form.Group className="mb-3">
             <Form.Label>Producto</Form.Label>
             <Form.Select name="producto_id" value={compra.producto_id} onChange={handleInputChange} required>
               <option value="">Selecciona un producto...</option>
               {productos.map(producto => (
                 <option key={producto.id} value={producto.id}>
                   {producto.nombre}
                </option>
              ))}
             </Form.Select>
          </Form.Group>
 
           {/* Campo de Cantidad */}
           <Form.Group className="mb-3">
             <Form.Label>Cantidad</Form.Label>
             <Form.Control
               type="number"
               name="cantidad"
               value={compra.cantidad}
               onChange={handleInputChange}
               min="1"
               required
             />
          </Form.Group>

          <Button variant="primary" type="submit">
             Registrar Compra
           </Button>
         </Form>
 
         {/* Mensaje de Éxito o Error */}
         {statusMessage.message && (
           <Alert variant={statusMessage.type} className="mt-3">
             {statusMessage.message}
           </Alert>
         )}
       </Card.Body>
     </Card>
   );
 }
 
 export default ComprasPage;
