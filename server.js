require('dotenv').config({ quiet: true });
const app = require('./src/app');
const pool = require('./src/config/db');

const PUERTO = process.env.PORT || 3000;

async function iniciar() {
  try {
    // Verifica la conexión a la base de datos antes de aceptar tráfico
    await pool.query('SELECT 1');
    console.log('Conexión a PostgreSQL establecida correctamente');

    app.listen(PUERTO, () => {
      console.log(`Servidor del SGI escuchando en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error('No fue posible conectar a la base de datos:', error.message);
    process.exit(1);
  }
}

iniciar();
