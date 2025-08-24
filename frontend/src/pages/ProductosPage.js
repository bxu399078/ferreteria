
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Card, Form, Alert } from 'react-bootstrap';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ nombre: ''});  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productNameToDelete, setProductNameToDelete] = useState(''); // <-- CAMBIO: Guardamos el nombre a borrar
  const [deleteError, setDeleteError] = useState(''); // <-- CAMBIO: Estado para el mensaje de error


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


  const handleShowAddModal = () => setShowAddModal(true);

  
     // --- 3. FUNCIONES PARA MANEJAR EL MODAL DE "AGREGAR producto" ---
  const handleCloseAddModal = () => {
       console.log("Cerrando modal agregar");
       setShowAddModal(false);
       setNewProduct({ nombre: '' }); // Reseteamos el formulario
     };
     
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewProduct({ ...newProduct, [name]: value });
   };  
      
   

  
  const handleFormSubmit = async (e) => {
       e.preventDefault(); // Prevenimos que la página se recargue
      console.log("enviando formulario");
       try {
         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/productos`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(newProduct),
         });
   
         if (response.ok) {
          const addedProduct = await response.json();
          setProductos([...productos, addedProduct]);
           handleCloseAddModal();
         console.log("listooo");
         }
         else{
            const errorData = await response.json();
            throw new Error(errorData.message || 'El producto no pudo ser agregado.');
         }
   
         /* const addedProduct = await response.json();
         // Actualizamos la lista de clientes en la página SIN recargar
         setProductos([...productos, addedProduct]);
         handleCloseAddModal(); */ // Cerramos el modal
   


       } catch (error) {
         console.error("Error al cargar:", error);
        
         // Aquí podrías mostrar un mensaje de error al usuario
       }
     }; 
     
     const handleShowDeleteModal = () => setShowDeleteModal(true);
     const handleCloseDeleteModal = () => {
           console.log("cerrando model de borrar");
           setShowDeleteModal(false);
           setProductNameToDelete(''); // Limpiamos el nombre
           setDeleteError(''); // Limpiamos el error
          };
    const handleDeleteInputChange = (e) => {
           setProductNameToDelete(e.target.value);
          };
       


    const handleDeleteSubmit = async (e) => {
          e.preventDefault();
          setDeleteError(''); // Reseteamos el error al intentar de nuevo
          console.log("enviando formulario borrar");  
           // 1. Buscar el producto en la lista local por nombre
           if (!productNameToDelete.trim()) {
                 setDeleteError("Por favor, escribe un nombre de producto.");
                 return;
              }
          
              
           // 3. Si se encuentra, proceder con el borrado usando su ID
           try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/productosd`, { // <-- URL correcta
                     method: 'POST', // <-- Método POST
                     headers: {
                       'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({ nombre: productNameToDelete }), // <-- Enviamos el nombre en el cuerpo
                   });
           
                   if (response.ok) {
                    setProductos(
                               productos.filter(p => p.nombre.toLowerCase() !== productNameToDelete.toLowerCase())
                             );
                             // 3. Y AHORA, cerramos el modal.
                            handleCloseDeleteModal();
                            console.log("listooo");
                   }
                   else{
                      const errorData = await response.json();
                    throw new Error(errorData.message || 'El producto no pudo ser borrado.');
                   }
              
               
              
              } catch (error) {
             console.error("Error al borrar:", error);
             setDeleteError(error.message);
           }
         };
  
     
  

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
               <Button variant="danger" onClick={handleShowDeleteModal}>
                 - Borrar Producto por Nombre
               </Button>
              
              
               <Modal show={showAddModal} onHide={handleCloseAddModal}>
                 <Modal.Header closeButton>
                   <Modal.Title>Agregar Nuevo Producto</Modal.Title>
                 </Modal.Header>
                 <Modal.Body>
                   <Form onSubmit={handleFormSubmit}>
                     <Modal.Body>
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
                     </Modal.Body>
                     <Button variant="secondary" onClick={handleCloseAddModal} className="me-2" type="button">
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Guardar Producto
                 </Button>
                  </Form>
                </Modal.Body>
              </Modal>

              

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Form onSubmit={handleDeleteSubmit}>
            <Modal.Header closeButton>
             <Modal.Title>Borrar Producto por Nombre</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              
                {/* Mostramos un mensaje de error si existe */}
                {deleteError && <Alert variant="danger">{deleteError}</Alert>}
    
                <Form.Group className="mb-3">
                  <Form.Label>Escribe el nombre exacto del producto a borrar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Martillo de Carpintero"
                    value={productNameToDelete}
                    onChange={handleDeleteInputChange}
                    required
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeleteModal} type="button">
                    Cancelar
                  </Button>
                  <Button variant="danger" type="submit">
                    Buscar y Borrar
                  </Button>
              </Modal.Footer>  
             </Form>
            
         </Modal>


                </div>
  );
};

export default ProductosPage;
