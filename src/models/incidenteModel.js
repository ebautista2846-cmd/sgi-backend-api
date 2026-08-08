const mongoose = require('mongoose');

// Capa de acceso a datos con Mongoose. Se conservan exactamente los mismos
// nombres de función que en la versión PostgreSQL (obtenerTodos, obtenerPorId,
// crear, actualizar, eliminar) para que el controlador no necesite cambios.

const CATEGORIAS = ['hardware', 'software', 'redes', 'accesos', 'otros'];
const PRIORIDADES = ['baja', 'media', 'alta', 'critica'];
const ESTADOS = ['abierto', 'en_proceso', 'resuelto', 'cerrado'];

const incidenteSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [150, 'El título no puede superar 150 caracteres'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    categoria: {
      type: String,
      enum: { values: CATEGORIAS, message: `Categoría inválida. Use: ${CATEGORIAS.join(', ')}` },
      default: 'otros',
    },
    prioridad: {
      type: String,
      enum: { values: PRIORIDADES, message: `Prioridad inválida. Use: ${PRIORIDADES.join(', ')}` },
      default: 'media',
    },
    estado: {
      type: String,
      enum: { values: ESTADOS, message: `Estado inválido. Use: ${ESTADOS.join(', ')}` },
      default: 'abierto',
    },
    solicitante: {
      type: String,
      required: [true, 'El solicitante es obligatorio'],
      trim: true,
    },
    asignado_a: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' },
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Incidente = mongoose.model('Incidente', incidenteSchema, 'incidentes');

function serializar(documento) {
  return documento ? documento.toJSON() : undefined;
}

async function obtenerTodos({ estado, prioridad } = {}) {
  const filtro = {};
  if (estado) filtro.estado = estado;
  if (prioridad) filtro.prioridad = prioridad;

  const documentos = await Incidente.find(filtro).sort({ fecha_creacion: -1 });
  return documentos.map(serializar);
}

async function obtenerPorId(id) {
  if (!mongoose.isValidObjectId(id)) return undefined;
  const documento = await Incidente.findById(id);
  return serializar(documento);
}

async function crear(datos) {
  const { titulo, descripcion, categoria, prioridad, estado, solicitante, asignado_a } = datos;
  const documento = await Incidente.create({
    titulo,
    descripcion,
    categoria: categoria || 'otros',
    prioridad,
    estado,
    solicitante,
    asignado_a: asignado_a || null,
  });
  return serializar(documento);
}

async function actualizar(id, datos) {
  if (!mongoose.isValidObjectId(id)) return undefined;

  const campos = {};
  for (const clave of ['titulo', 'descripcion', 'categoria', 'prioridad', 'estado', 'solicitante', 'asignado_a']) {
    if (datos[clave] !== undefined) campos[clave] = datos[clave];
  }

  const documento = await Incidente.findByIdAndUpdate(id, campos, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  return serializar(documento);
}

async function eliminar(id) {
  if (!mongoose.isValidObjectId(id)) return undefined;
  const documento = await Incidente.findByIdAndDelete(id);
  return documento ? { id: documento._id.toString() } : undefined;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, Incidente, ESTADOS, PRIORIDADES, CATEGORIAS };
