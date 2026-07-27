const incidenteModel = require('../models/incidenteModel');

// Envuelve cada controlador async para reenviar cualquier excepción al
// middleware de errores en lugar de tener try/catch repetido en cada uno.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const listar = asyncHandler(async (req, res) => {
  const { estado, prioridad } = req.query;
  const incidentes = await incidenteModel.obtenerTodos({ estado, prioridad });
  res.status(200).json({ exito: true, total: incidentes.length, datos: incidentes });
});

const obtener = asyncHandler(async (req, res) => {
  const incidente = await incidenteModel.obtenerPorId(req.params.id);
  if (!incidente) {
    return res.status(404).json({ exito: false, mensaje: `No existe un incidente con id ${req.params.id}` });
  }
  res.status(200).json({ exito: true, datos: incidente });
});

const crear = asyncHandler(async (req, res) => {
  const nuevoIncidente = await incidenteModel.crear(req.body);
  res.status(201).json({ exito: true, mensaje: 'Incidente creado correctamente', datos: nuevoIncidente });
});

const actualizar = asyncHandler(async (req, res) => {
  const existente = await incidenteModel.obtenerPorId(req.params.id);
  if (!existente) {
    return res.status(404).json({ exito: false, mensaje: `No existe un incidente con id ${req.params.id}` });
  }
  const actualizado = await incidenteModel.actualizar(req.params.id, req.body);
  res.status(200).json({ exito: true, mensaje: 'Incidente actualizado correctamente', datos: actualizado });
});

const eliminar = asyncHandler(async (req, res) => {
  const eliminado = await incidenteModel.eliminar(req.params.id);
  if (!eliminado) {
    return res.status(404).json({ exito: false, mensaje: `No existe un incidente con id ${req.params.id}` });
  }
  res.status(200).json({ exito: true, mensaje: `Incidente ${req.params.id} eliminado correctamente` });
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
