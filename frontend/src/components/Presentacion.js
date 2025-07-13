
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Presentacion = () => {
/*  const [productos, setProductos] = useState([]);

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
 */
  return (
    <div>
      <h2>Holas Amigos</h2>
      <ul>
       
      </ul>
    </div>
  );
};

export default Presentacion;
