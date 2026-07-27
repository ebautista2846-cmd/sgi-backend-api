// Middleware de manejo centralizado de errores. Express lo reconoce por
// tener cuatro parámetros y lo invoca cuando se llama a next(err) o cuando
// un controlador async lanza una excepción no capturada.
function manejadorErrores(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${err.stack || err}`);

  if (err.code === '23505') {
    return res.status(409).json({ exito: false, mensaje: 'El registro ya existe (violación de restricción única)' });
  }

  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.expuesto ? err.message : 'Error interno del servidor',
  });
}

function rutaNoEncontrada(req, res) {
  res.status(404).json({ exito: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = { manejadorErrores, rutaNoEncontrada };
