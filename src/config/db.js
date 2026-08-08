const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

async function conectar() {
  if (!process.env.MONGODB_URI) {
    throw new Error('La variable de entorno MONGODB_URI no está definida');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  return mongoose.connection;
}

module.exports = { conectar, mongoose };
