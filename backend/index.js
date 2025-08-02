
require('dotenv').config();


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

const PDFDocument = require('pdfkit');

app.use(cors());
app.use(express.json());

//console.log(process.env.DATABASE_URl)

const pool = new Pool({
  connectionString: process.env.DATABASE_URl,
  ssl:{
    rejectUnauthorized: false
  }
});
  

  /* const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}); */   
  

app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cliente');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clientes', async (req, res) => {
  console.log(req.body);
  try {
    // 1. Obtenemos los datos del cuerpo (body) de la petición
    const { nombre } = req.body;

    // 2. Validación básica para asegurarnos de que tenemos los datos necesarios
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre y el email son obligatorios.' });
    }

    // 3. Insertamos el nuevo cliente en la base de datos y usamos
    //    'RETURNING *' para que nos devuelva el objeto completo que se acaba de crear.
    const nuevoCliente = await pool.query(
      'INSERT INTO cliente (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );

    // 4. Respondemos con un código 201 (Creado) y el objeto del nuevo cliente.
    res.status(201).json(nuevoCliente.rows[0]);

  } catch (error) {
    console.error('Error al crear el cliente:', error);
    // Manejo de errores comunes, como un email duplicado
    if (error.code === '23505') { // Código de error de PostgreSQL para 'unique_violation'
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }
   res.status(500).send('Error interno al crear el cliente');
  }
});

app.post('/api/productos', async (req, res) => {
  console.log(req.body);
  try {
    // 1. Obtenemos los datos del cuerpo (body) de la petición
    const { nombre } = req.body;

    // 2. Validación básica para asegurarnos de que tenemos los datos necesarios
    if (!nombre) {
      return res.status(400).json({ message: 'El producto es obligatorio' });
    }

    // 3. Insertamos el nuevo cliente en la base de datos y usamos
    //    'RETURNING *' para que nos devuelva el objeto completo que se acaba de crear.
    const nuevoProducto = await pool.query(
      'INSERT INTO productos (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );

    // 4. Respondemos con un código 201 (Creado) y el objeto del nuevo cliente.
    res.status(201).json(nuevoProducto.rows[0]);

  } catch (error) {
    console.error('Error al crear el producto:', error);
    // Manejo de errores comunes, como un email duplicado
    if (error.code === '23505') { // Código de error de PostgreSQL para 'unique_violation'
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }
   res.status(500).send('Error interno al crear el producto');
  }
});


app.get('/api/reporte', async (req, res) => {
     try {
       // 1. Obtenemos todos los clientes de la base de datos
       const { rows: clientes } = await pool.query('SELECT * FROM cliente ORDER BY nombre ASC');
   
       // 2. Creamos un nuevo documento PDF en memoria
       const doc = new PDFDocument({ margin: 50 });
   
       // 3. Configuramos las cabeceras de la respuesta para que el navegador
       //    sepa que está descargando un archivo PDF.
       res.setHeader('Content-Type', 'application/pdf');
       res.setHeader('Content-Disposition', 'attachment; filename=reporte-clientes.pdf');
   
       // 4. "Conectamos" el documento PDF a la respuesta. Todo lo que escribamos
       //    en el 'doc' se enviará al navegador.
       doc.pipe(res);
   
       // 5. Empezamos a construir el PDF
       // Cabecera del documento
       doc.fontSize(18).text('Reporte de Clientetazos', { align: 'center' });
       doc.moveDown();
   
       // Línea de separación
       doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
       doc.moveDown();
   
       // Contenido - Iteramos sobre cada cliente
       clientes.forEach(cliente => {
         doc.fontSize(12).text(`ID: ${cliente.id}`, { continued: true });
         doc.text(` - Nombre: ${cliente.nombre}`, { align: 'left' });
         doc.fontSize(10).fillColor('gray').text(`Email: ${cliente.email} | Teléfono: ${cliente.telefono}`);
         doc.moveDown(0.5);
       });
   
       // 6. Finalizamos el documento. Esto es muy importante.
       doc.end();
   
     } catch (error) {
       console.error('Error al generar el reporte PDF:', error);
       res.status(500).send('Error interno al generar el reporte');
     }
  });


  app.get('/api/reporteproducto', async (req, res) => {
    try {
      // 1. Obtenemos todos los clientes de la base de datos
      const { rows: productos } = await pool.query('SELECT * FROM productos ORDER BY nombre ASC');
  
      // 2. Creamos un nuevo documento PDF en memoria
      const doc = new PDFDocument({ margin: 50 });
  
      // 3. Configuramos las cabeceras de la respuesta para que el navegador
      //    sepa que está descargando un archivo PDF.
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-productos.pdf');
  
      // 4. "Conectamos" el documento PDF a la respuesta. Todo lo que escribamos
      //    en el 'doc' se enviará al navegador.
      doc.pipe(res);
  
      // 5. Empezamos a construir el PDF
      // Cabecera del documento
      doc.fontSize(18).text('Reporte de Productasos', { align: 'center' });
      doc.moveDown();
  
      // Línea de separación
      doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
  
      // Contenido - Iteramos sobre cada cliente
      productos.forEach(productos => {
        doc.fontSize(12).text(`ID: ${productos.id}`, { continued: true });
        doc.text(` - Nombre: ${productos.nombre}`, { align: 'left' });
        //doc.fontSize(10).fillColor('gray').text(`Email: ${cliente.email} | Teléfono: ${cliente.telefono}`);
        doc.moveDown(0.5);
      });
  
      // 6. Finalizamos el documento. Esto es muy importante.
      doc.end();
  
    } catch (error) {
      console.error('Error al generar el reporte PDF:', error);
      res.status(500).send('Error interno al generar el reporte');
    }
 });


  app.get('/api/clientes/:id', async (req, res) => {
    try {
      const { id } = req.params; // Obtenemos el ID de la URL
      const resultado = await pool.query('SELECT * FROM cliente WHERE id = $1', [id]);
  
      // Si no encontramos un cliente con ese ID, devolvemos un error 404
      if (resultado.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
  
      // Si lo encontramos, devolvemos el primer (y único) resultado
      res.json(resultado.rows[0]);
  
    } catch (error) {
      console.error('Error al consultar cliente por ID:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
