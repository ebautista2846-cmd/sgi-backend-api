const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones a PostgreSQL. Reutilizar el pool evita abrir una
// conexión nueva en cada petición, que es el principal cuello de botella
// de una API bajo carga.
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'sgi_db',
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL', err);
  process.exit(1);
});

module.exports = pool;
