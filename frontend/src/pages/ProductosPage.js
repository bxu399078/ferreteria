
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Card, Form } from 'react-bootstrap';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);

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
    </div>
  );
};

export default ProductosPage;
