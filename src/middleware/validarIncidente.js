const { body, param, query, validationResult } = require('express-validator');

const ESTADOS = ['abierto', 'en_progreso', 'resuelto', 'cerrado'];
const PRIORIDADES = ['baja', 'media', 'alta', 'critica'];

function manejarErrores(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error de validación en los datos enviados',
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}

const reglasCrear = [
  body('titulo').trim().notEmpty().withMessage('El título es obligatorio')
    .isLength({ max: 150 }).withMessage('El título no puede superar 150 caracteres'),
  body('descripcion').trim().notEmpty().withMessage('La descripción es obligatoria'),
  body('solicitante').trim().notEmpty().withMessage('El solicitante es obligatorio'),
  body('prioridad').optional().isIn(PRIORIDADES).withMessage(`Prioridad inválida. Use: ${PRIORIDADES.join(', ')}`),
  body('estado').optional().isIn(ESTADOS).withMessage(`Estado inválido. Use: ${ESTADOS.join(', ')}`),
  manejarErrores,
];

const reglasActualizar = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  body('titulo').optional().trim().isLength({ max: 150 }),
  body('prioridad').optional().isIn(PRIORIDADES).withMessage(`Prioridad inválida. Use: ${PRIORIDADES.join(', ')}`),
  body('estado').optional().isIn(ESTADOS).withMessage(`Estado inválido. Use: ${ESTADOS.join(', ')}`),
  manejarErrores,
];

const reglasId = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  manejarErrores,
];

const reglasFiltros = [
  query('estado').optional().isIn(ESTADOS),
  query('prioridad').optional().isIn(PRIORIDADES),
  manejarErrores,
];

module.exports = { reglasCrear, reglasActualizar, reglasId, reglasFiltros };
