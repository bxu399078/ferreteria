
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Card } from 'react-bootstrap';


const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
   
      // Función para cerrar el modal
  const handleCloseModal = () => setShowModal(false);


  useEffect(() => {
    //axios.get('http://localhost:3001/api/clientes')
    axios.get(`${process.env.REACT_APP_API_URL}/api/clientes`)
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const obtenerClientePorId = async (id) => {
         try {
           const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clientes/${id}`);
           if (!response.ok) {
             throw new Error('Cliente no encontrado');
           }
           const data = await response.json();
           setClienteSeleccionado(data); // Guardamos el cliente en nuestro nuevo estado
           setShowModal(true);
          } catch (error) {
           console.error("Error al buscar cliente:", error);
           setClienteSeleccionado({ nombre: 'No encontrado' }); // Manejo de error
           setShowModal(true); 
          }
       };
 

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
      <div>
             {/* Por ahora, le pedimos el cliente con ID=1. ¡Puedes cambiarlo! */}
             <button onClick={() => obtenerClientePorId(1)}>
              Clientazo
             </button>
             {/* Mostramos el nombre del cliente solo si existe en nuestro estado */}
             {/* {clienteSeleccionado && (
               <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
                 Cliente seleccionado: {clienteSeleccionado.nombre}
               </p>
             )} */}
      </div>
        {clientes.map(cliente => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}

      {clienteSeleccionado && (
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Detalles del Cliente</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>ID:</strong> {clienteSeleccionado.id}</p>
                <p><strong>Nombre:</strong> {clienteSeleccionado.nombre}</p>
                <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
                <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          )}


      </ul>
          {/* --- NUEVA TARJETA PARA REPORTES --- */}
       <Card className="my-3 card-transparent">
        <Card.Body>
           <Card.Title>Reportes</Card.Title>
            <Button
               as="a" // Le decimos que se comporte como un enlace
               href={`${process.env.REACT_APP_API_URL}/api/clientes/reporte`}
                 target="_blank" // Opcional: abre la descarga en una nueva pestaña
                 rel="noopener noreferrer"
                 variant="success"
               >
                 Descargar Informe de Clientes (PDF)
               </Button>
             </Card.Body>
           </Card>
          {/* --- FIN DE LA NUEVA TARJETA --- */}


    </div>
    
 
  );
};

export default ClientesPage;
