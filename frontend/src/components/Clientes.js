
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

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

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
