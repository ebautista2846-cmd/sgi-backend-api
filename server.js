if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ quiet: true });
}
const app = require('./src/app');
const { conectar } = require('./src/config/db');

const PUERTO = process.env.PORT || 3000;

async function iniciar() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'PRESENTE' : 'AUSENTE');
  try {
    await conectar();
    console.log('Conexión a MongoDB Atlas establecida correctamente');

    app.listen(PUERTO, () => {
      console.log(`Servidor del SGI escuchando en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error('No fue posible conectar a la base de datos:', error.message);
    process.exit(1);
  }
}

iniciar();
