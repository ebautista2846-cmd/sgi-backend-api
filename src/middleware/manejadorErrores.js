function manejadorErrores(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${err.stack || err}`);

  if (err.code === 11000) {
    return res.status(409).json({ exito: false, mensaje: 'El registro ya existe (violación de restricción única)' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error de validación en los datos enviados',
      errores: Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message })),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ exito: false, mensaje: `Id inválido: ${err.value}` });
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
