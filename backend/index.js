
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//console.log(process.env.DATABASE_URl)

const pool = new Pool({
  connectionString: process.env.DATABASE_URl,
  ssl:{
    rejectUnauthorized: false
  }
});
 

/*  const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}); 
 */

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
