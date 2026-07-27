const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const incidenteRoutes = require('./routes/incidenteRoutes');
const { manejadorErrores, rutaNoEncontrada } = require('./middleware/manejadorErrores');

const app = express();

// --- Middlewares de seguridad y utilidad ---
app.use(helmet());                    // cabeceras HTTP seguras (evita fuga de info del stack, XSS, etc.)
app.use(cors());                      // habilita peticiones cross-origin para el frontend (Angular/React)
app.use(compression());               // comprime las respuestas JSON
app.use(express.json({ limit: '10kb' })); // body parser con límite para mitigar payloads abusivos
app.use(morgan('dev'));               // log de peticiones en consola, útil para depuración

// --- Ruta de salud, útil para monitoreo y para probar conectividad ---
app.get('/api/salud', (req, res) => {
  res.status(200).json({ exito: true, mensaje: 'API del Sistema de Gestión de Incidentes operativa', fecha: new Date().toISOString() });
});

// --- Rutas de negocio ---
app.use('/api/incidentes', incidenteRoutes);

// --- 404 y manejo de errores (siempre al final) ---
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;
