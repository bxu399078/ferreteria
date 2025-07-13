
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
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
      <h2>Clientes</h2>
      <ul>
      <div>
             {/* Por ahora, le pedimos el cliente con ID=1. ¡Puedes cambiarlo! */}
             <button onClick={() => obtenerClientePorId(1)}>
              Obtener Nombre del Cliente 1
             </button>
             {/* Mostramos el nombre del cliente solo si existe en nuestro estado */}
             {clienteSeleccionado && (
               <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
                 Cliente seleccionado: {clienteSeleccionado.nombre}
               </p>
             )}
      </div>
        {clientes.map(cliente => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}
      </ul>
    </div>
    
 
  );
};

export default Clientes;
