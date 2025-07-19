
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

const Presentacion = () => {
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
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
           } catch (error) {
             console.error("Error al buscar cliente:", error);
             setClienteSeleccionado({ nombre: 'No encontrado' }); // Manejo de error
           }
         };
   
  
         return (
               <div>
                 <h2>Clientes de 10</h2>
           
                 <Card className="my-3" style={{background: "linear-gradient(to bottom,rgb(22, 44, 188),rgb(171, 213, 227))"}}>
                   <Card.Body>
                     <Card.Title>Buscar Cliente por ID</Card.Title>
                     <Button onClick={() => obtenerClientePorId(1)} variant="primary">
                       Obtener Cliente 1
                     </Button>
                     {clienteSeleccionado && (
                       <p className="mt-3">
                         <b>Cliente:</b> {clienteSeleccionado.nombre}
                       </p>
                     )}
                   </Card.Body>
                 </Card>
           
              </div>
            );   
           
        
      
  };

export default Presentacion;
