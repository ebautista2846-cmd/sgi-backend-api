const pool = require('../config/db');

// Capa de acceso a datos: cada función ejecuta una sola sentencia SQL
// parametrizada ($1, $2, ...) para prevenir inyección SQL.

const CAMPOS = `id, titulo, descripcion, categoria, prioridad, estado,
                solicitante, asignado_a, fecha_creacion, fecha_actualizacion`;

async function obtenerTodos({ estado, prioridad } = {}) {
  const condiciones = [];
  const valores = [];

  if (estado) {
    valores.push(estado);
    condiciones.push(`estado = $${valores.length}`);
  }
  if (prioridad) {
    valores.push(prioridad);
    condiciones.push(`prioridad = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT ${CAMPOS} FROM incidentes ${where} ORDER BY fecha_creacion DESC`,
    valores
  );
  return rows;
}

async function obtenerPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS} FROM incidentes WHERE id = $1`,
    [id]
  );
  return rows[0];
}

async function crear(datos) {
  const { titulo, descripcion, categoria, prioridad, estado, solicitante, asignado_a } = datos;
  const { rows } = await pool.query(
    `INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, estado, solicitante, asignado_a)
     VALUES ($1, $2, $3, COALESCE($4, 'media'), COALESCE($5, 'abierto'), $6, $7)
     RETURNING ${CAMPOS}`,
    [titulo, descripcion, categoria || 'general', prioridad, estado, solicitante, asignado_a || null]
  );
  return rows[0];
}

async function actualizar(id, datos) {
  const { titulo, descripcion, categoria, prioridad, estado, solicitante, asignado_a } = datos;
  const { rows } = await pool.query(
    `UPDATE incidentes SET
        titulo      = COALESCE($1, titulo),
        descripcion = COALESCE($2, descripcion),
        categoria   = COALESCE($3, categoria),
        prioridad   = COALESCE($4, prioridad),
        estado      = COALESCE($5, estado),
        solicitante = COALESCE($6, solicitante),
        asignado_a  = COALESCE($7, asignado_a)
     WHERE id = $8
     RETURNING ${CAMPOS}`,
    [titulo, descripcion, categoria, prioridad, estado, solicitante, asignado_a, id]
  );
  return rows[0];
}

async function eliminar(id) {
  const { rows } = await pool.query(
    `DELETE FROM incidentes WHERE id = $1 RETURNING id`,
    [id]
  );
  return rows[0];
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
