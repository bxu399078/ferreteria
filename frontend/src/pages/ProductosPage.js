
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Card, Form } from 'react-bootstrap';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setproductoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
   
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ nombre: ''});
  
  

     // --- 3. FUNCIONES PARA MANEJAR EL MODAL DE "AGREGAR CLIENTE" ---
     const handleCloseAddModal = () => {
       setShowAddModal(false);
       setNewProduct({ nombre: '' }); // Reseteamos el formulario
     };
     const handleShowAddModal = () => setShowAddModal(true);
   
     const handleInputChange = (e) => {
       const { name, value } = e.target;
       setNewProduct({ ...newProduct, [name]: value });
    };
  
     const handleFormSubmit = async (e) => {
       e.preventDefault(); // Prevenimos que la página se recargue
       try {
         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/productos`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(newProduct),
         });
   
         if (!response.ok) {
           throw new Error('Error al crear el producto');
         }
   
         const addedProduct = await response.json();
         // Actualizamos la lista de clientes en la página SIN recargar
         setProductos([...productos, addedProduct]);
         handleCloseAddModal(); // Cerramos el modal
   
       } catch (error) {
         console.error("Error en el formulario:", error);
         // Aquí podrías mostrar un mensaje de error al usuario
       }
     }; 

  useEffect(() => {
    //'http://localhost:3001/api/productos')
    axios.get(`${process.env.REACT_APP_API_URL}/api/productos`)
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {productos.map(producto => (
          <li key={producto.id}>{producto.nombre} - ${producto.precio}</li>
        ))}
      </ul>
        {/* --- NUEVA TARJETA PARA REPORTES --- */}
             <Card className="my-3 card-transparent">
              <Card.Body>
                 <Card.Title>Reportes</Card.Title>
                  <Button
                     as="a" // Le decimos que se comporte como un enlace
                     href={`${process.env.REACT_APP_API_URL}/api/reporteproducto`}
                       target="_blank" // Opcional: abre la descarga en una nueva pestaña
                       rel="noopener noreferrer"
                       variant="success"
                     >
                       Descargar Informe de Productos (PDF)
                     </Button>
                   </Card.Body>
                 </Card>
                {/* --- FIN DE LA NUEVA TARJETA --- */}
    {/* --- 4. BOTÓN PARA ABRIR EL MODAL DE "AGREGAR producto" --- */}
               <Button variant="primary" onClick={handleShowAddModal} className="mb-3">
                 + Agregar Nuevo Producto
               </Button>
               <Modal show={showAddModal} onHide={handleCloseAddModal}>
                 <Modal.Header closeButton>
                   <Modal.Title>Agregar Nuevo Producto</Modal.Title>
                 </Modal.Header>
                 <Modal.Body>
                   <Form onSubmit={handleFormSubmit}>
                     <Form.Group className="mb-3">
                       <Form.Label>Nombre</Form.Label>
                       <Form.Control
                         type="text"
                         name="nombre"
                         value={newProduct.nombre}
                         onChange={handleInputChange}
                         required
                      />
                     </Form.Group>
                     <Button variant="secondary" onClick={handleCloseAddModal} className="me-2">
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Guardar Producto
                 </Button>
                  </Form>
                </Modal.Body>
              </Modal>
    </div>
  );
};

export default ProductosPage;
