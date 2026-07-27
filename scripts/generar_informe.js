const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  ImageRun, PageBreak, Header, Footer, PageNumber, VerticalAlign,
} = require("docx");

const BASE = path.resolve(__dirname, "..");
const EVID = path.join(BASE, "evidencias");

function imgSize(file, maxWidth) {
  // Lee dimensiones reales desde el archivo .dims.json generado previamente
  const dims = JSON.parse(fs.readFileSync(path.join(EVID, "dims.json"), "utf8"));
  const [w, h] = dims[file];
  const width = Math.min(w, maxWidth);
  const height = Math.round(h * (width / w));
  return { width, height };
}

const AZUL = "1E3A8A";
const GRIS = "475569";
const GRIS_CLARO = "F1F5F9";

function celda(texto, { bold = false, shading = null, width, align = AlignmentType.LEFT, color = null } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shading ? { type: ShadingType.CLEAR, fill: shading } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text: texto, bold, color: color || undefined, size: 20 })],
    })],
  });
}

function filaEncabezado(cols, widths) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((c, i) => celda(c, { bold: true, shading: AZUL, width: widths[i], color: "FFFFFF" })),
  });
}

function filaDatos(cols, widths, shading = null) {
  return new TableRow({
    children: cols.map((c, i) => celda(c, { width: widths[i], shading })),
  });
}

function tituloSeccion(texto, numero) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text: `${numero}. ${texto}`, bold: true, color: AZUL, size: 28 })],
  });
}

function subtitulo(texto) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text: texto, bold: true, color: GRIS, size: 24 })],
  });
}

function parrafo(texto, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 300 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text: texto, size: 22, ...opts })],
  });
}

function imagenCentrada(file, maxWidth, caption) {
  const { width, height } = imgSize(file, maxWidth);
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 80 },
      children: [new ImageRun({
        type: "png",
        data: fs.readFileSync(path.join(EVID, file)),
        transformation: { width, height },
      })],
    }),
  ];
  if (caption) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: caption, italics: true, size: 18, color: GRIS })],
    }));
  }
  return children;
}

function codigoBloque(lineas) {
  return new Table({
    width: { size: 9350, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
    },
    rows: [new TableRow({ children: [new TableCell({
      shading: { type: ShadingType.CLEAR, fill: "0F172A" },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      children: lineas.map((l) => new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: l, font: "Courier New", size: 18, color: "E2E8F0" })],
      })),
    })] })],
  });
}

// ---------------------------------------------------------------
// PORTADA
// ---------------------------------------------------------------
const portada = [
  new Paragraph({ spacing: { after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "UNIVERSIDAD TÉCNICA DE MANABÍ", bold: true, size: 34, color: AZUL })] }),
  new Paragraph({ spacing: { after: 40 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Facultad de Ciencias Informáticas", size: 26, color: GRIS })] }),
  new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Carrera de Tecnologías de la Información", size: 26, color: GRIS })] }),

  new Paragraph({ spacing: { before: 800, after: 200 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "DESARROLLO DE SISTEMAS INFORMÁTICOS", bold: true, size: 30 })] }),
  new Paragraph({ spacing: { after: 100 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Unidad 4: Desarrollo de sistemas y bases de datos", size: 24, italics: true, color: GRIS })] }),
  new Paragraph({ spacing: { after: 600 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Actividad 8", bold: true, size: 24, color: GRIS })] }),

  new Paragraph({ spacing: { before: 400, after: 700 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Desarrollo del Backend y Base de Datos (API REST)\nSistema de Gestión de Incidentes", bold: true, size: 26, color: AZUL, break: 1 })] }),

  new Paragraph({ spacing: { before: 900, after: 60 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Estudiante", size: 20, color: GRIS })] }),
  new Paragraph({ spacing: { after: 500 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Erick", bold: true, size: 26 })] }),

  new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Quinto semestre", size: 20, color: GRIS })] }),

  new Paragraph({ spacing: { before: 900 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Manabí, Ecuador — julio de 2026", size: 20, color: GRIS })] }),

  new Paragraph({ children: [new PageBreak()] }),
];

// ---------------------------------------------------------------
// 1. INTRODUCCIÓN / OBJETIVO
// ---------------------------------------------------------------
const seccion1 = [
  tituloSeccion("Introducción", 1),
  parrafo(
    "El presente informe documenta el desarrollo del backend y la base de datos del Sistema de Gestión de Incidentes (SGI), correspondiente a la Actividad 8 de la Unidad 4 de la asignatura Desarrollo de Sistemas Informáticos. El sistema permite registrar, consultar, actualizar y eliminar incidentes o tickets reportados por los usuarios de una mesa de ayuda, siguiendo una arquitectura cliente-servidor desacoplada mediante una API RESTful."
  ),
  subtitulo("Objetivo"),
  parrafo(
    "Construir la arquitectura del lado del servidor (backend) y la base de datos del Sistema de Gestión de Incidentes, aplicando tecnologías de nivel industrial para exponer una API RESTful escalable y segura, con operaciones CRUD completas sobre el recurso de incidentes."
  ),
  subtitulo("Tecnologías utilizadas"),
  parrafo(
    "Para el servidor se utilizó Node.js con el framework Express, por su madurez y su amplia adopción en proyectos de nivel industrial. Como motor de base de datos se optó por PostgreSQL, una base de datos relacional robusta que permite modelar con precisión las restricciones del dominio (estados y prioridades válidas, claves primarias, índices). El acceso a datos se realiza mediante el driver oficial pg, con consultas parametrizadas para evitar inyección SQL. La validación de las peticiones entrantes se maneja con express-validator, y la seguridad de las cabeceras HTTP con helmet."
  ),
];

// ---------------------------------------------------------------
// 2. ARQUITECTURA
// ---------------------------------------------------------------
const seccion2 = [
  tituloSeccion("Arquitectura del Backend", 2),
  parrafo(
    "El servidor sigue una arquitectura por capas, que separa claramente las responsabilidades y facilita el mantenimiento y las pruebas. Una petición HTTP atraviesa primero las rutas, luego los middlewares de validación, después el controlador correspondiente y finalmente el modelo, que es el único punto del sistema que ejecuta sentencias SQL contra la base de datos."
  ),
  ...imagenCentrada("arquitectura.png", 600, "Figura 1. Arquitectura por capas del backend del SGI."),
  subtitulo("Descripción de las capas"),
  parrafo(
    "Las rutas (routes/incidenteRoutes.js) declaran los cinco endpoints del recurso incidentes y los asocian con su middleware de validación y su controlador. Los middlewares (middleware/validarIncidente.js) verifican que los datos recibidos cumplan las reglas del dominio antes de que lleguen al controlador, por ejemplo que el título no esté vacío o que la prioridad sea uno de los valores permitidos. Los controladores (controllers/incidenteController.js) coordinan la petición y la respuesta HTTP, delegando toda la lógica de acceso a datos al modelo. El modelo (models/incidenteModel.js) concentra las consultas SQL parametrizadas, de modo que ninguna otra capa del sistema construye SQL directamente."
  ),
];

// ---------------------------------------------------------------
// 3. BASE DE DATOS
// ---------------------------------------------------------------
const anchoTabla3 = [2200, 1600, 3350, 2200];
const seccion3 = [
  tituloSeccion("Diseño de la Base de Datos", 3),
  parrafo(
    "Se diseñó una única tabla, incidentes, que modela cada ticket reportado. El estado y la prioridad están restringidos mediante cláusulas CHECK para garantizar la integridad de los datos, y un disparador (trigger) actualiza automáticamente la fecha de modificación en cada UPDATE."
  ),
  new Table({
    width: { size: 9350, type: WidthType.DXA },
    columnWidths: anchoTabla3,
    rows: [
      filaEncabezado(["Campo", "Tipo", "Restricción", "Descripción"], anchoTabla3),
      filaDatos(["id", "SERIAL", "PRIMARY KEY", "Identificador único autoincremental"], anchoTabla3, GRIS_CLARO),
      filaDatos(["titulo", "VARCHAR(150)", "NOT NULL", "Título breve del incidente"], anchoTabla3),
      filaDatos(["descripcion", "TEXT", "NOT NULL", "Detalle del incidente reportado"], anchoTabla3, GRIS_CLARO),
      filaDatos(["categoria", "VARCHAR(50)", "DEFAULT 'general'", "Categoría (hardware, software, red...)"], anchoTabla3),
      filaDatos(["prioridad", "VARCHAR(20)", "CHECK IN (baja, media, alta, critica)", "Nivel de urgencia"], anchoTabla3, GRIS_CLARO),
      filaDatos(["estado", "VARCHAR(20)", "CHECK IN (abierto, en_progreso, resuelto, cerrado)", "Estado actual del ticket"], anchoTabla3),
      filaDatos(["solicitante", "VARCHAR(100)", "NOT NULL", "Persona que reporta el incidente"], anchoTabla3, GRIS_CLARO),
      filaDatos(["asignado_a", "VARCHAR(100)", "—", "Técnico responsable de atenderlo"], anchoTabla3),
      filaDatos(["fecha_creacion", "TIMESTAMP", "DEFAULT NOW()", "Fecha de creación del registro"], anchoTabla3, GRIS_CLARO),
      filaDatos(["fecha_actualizacion", "TIMESTAMP", "DEFAULT NOW(), trigger", "Última modificación (automática)"], anchoTabla3),
    ],
  }),
  new Paragraph({ spacing: { before: 240, after: 120 } }),
  subtitulo("Índices y rendimiento"),
  parrafo(
    "Se crearon índices sobre las columnas estado y prioridad, ya que son los criterios de filtrado más frecuentes en una mesa de ayuda (por ejemplo, listar todos los incidentes abiertos de prioridad crítica), lo que evita un recorrido secuencial completo de la tabla en cada consulta."
  ),
  subtitulo("Sentencia DDL"),
  codigoBloque([
    "CREATE TABLE incidentes (",
    "    id              SERIAL PRIMARY KEY,",
    "    titulo          VARCHAR(150) NOT NULL,",
    "    descripcion     TEXT NOT NULL,",
    "    categoria       VARCHAR(50)  NOT NULL DEFAULT 'general',",
    "    prioridad       VARCHAR(20)  NOT NULL DEFAULT 'media'",
    "                    CHECK (prioridad IN ('baja','media','alta','critica')),",
    "    estado          VARCHAR(20)  NOT NULL DEFAULT 'abierto'",
    "                    CHECK (estado IN ('abierto','en_progreso','resuelto','cerrado')),",
    "    solicitante     VARCHAR(100) NOT NULL,",
    "    asignado_a      VARCHAR(100),",
    "    fecha_creacion      TIMESTAMP NOT NULL DEFAULT NOW(),",
    "    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT NOW()",
    ");",
  ]),
];

// ---------------------------------------------------------------
// 4. ENDPOINTS
// ---------------------------------------------------------------
const anchoTabla4 = [1400, 3150, 4800];
const seccion4 = [
  tituloSeccion("Endpoints RESTful", 4),
  parrafo(
    "La API expone cinco endpoints sobre el recurso incidentes, cubriendo el ciclo CRUD completo, más un endpoint de salud para verificar la disponibilidad del servicio."
  ),
  new Table({
    width: { size: 9350, type: WidthType.DXA },
    columnWidths: anchoTabla4,
    rows: [
      filaEncabezado(["Método", "Ruta", "Descripción"], anchoTabla4),
      filaDatos(["GET", "/api/salud", "Verifica que la API esté operativa"], anchoTabla4, GRIS_CLARO),
      filaDatos(["GET", "/api/incidentes", "Lista todos los incidentes (admite ?estado= y ?prioridad=)"], anchoTabla4),
      filaDatos(["GET", "/api/incidentes/:id", "Obtiene un incidente específico por id"], anchoTabla4, GRIS_CLARO),
      filaDatos(["POST", "/api/incidentes", "Crea un nuevo incidente"], anchoTabla4),
      filaDatos(["PUT", "/api/incidentes/:id", "Actualiza un incidente existente"], anchoTabla4, GRIS_CLARO),
      filaDatos(["DELETE", "/api/incidentes/:id", "Elimina un incidente"], anchoTabla4),
    ],
  }),
  new Paragraph({ spacing: { before: 240, after: 120 } }),
  subtitulo("Formato de respuesta"),
  parrafo(
    "Todas las respuestas siguen una envoltura JSON uniforme con un campo booleano exito, un mensaje descriptivo cuando aplica, y los datos solicitados. Ante datos inválidos la API responde con código HTTP 400 y el detalle de cada error de validación; ante un recurso inexistente responde 404."
  ),
];

// ---------------------------------------------------------------
// 5. SEGURIDAD
// ---------------------------------------------------------------
const seccion5 = [
  tituloSeccion("Seguridad y Buenas Prácticas", 5),
  parrafo(
    "Todas las consultas SQL se ejecutan de forma parametrizada a través del driver pg, lo que elimina el riesgo de inyección SQL incluso cuando los datos provienen directamente del cuerpo de la petición. El middleware helmet añade cabeceras HTTP que mitigan ataques comunes como el sniffing de tipo MIME o el clickjacking. El tamaño del cuerpo de las peticiones está limitado a 10 kB para reducir la superficie de ataques de denegación de servicio por payloads excesivos. Las credenciales de la base de datos se gestionan mediante variables de entorno (.env), que se excluyen del control de versiones a través de .gitignore, y el repositorio distribuye únicamente un .env.example como referencia."
  ),
];

// ---------------------------------------------------------------
// 6. EVIDENCIAS
// ---------------------------------------------------------------
const seccion6 = [
  new Paragraph({ children: [new PageBreak()] }),
  tituloSeccion("Pruebas de Conectividad — Evidencias", 6),
  parrafo(
    "Las rutas de la API se probaron con cURL contra el servidor en ejecución, conectado a una instancia real de PostgreSQL con los datos semilla definidos en el esquema. A continuación se documenta cada prueba junto con la petición ejecutada y la respuesta obtenida."
  ),
  ...imagenCentrada("capturas/evidencia_01.png", 560, "Evidencia 1. Verificación de conectividad — GET /api/salud (HTTP 200)."),
  ...imagenCentrada("capturas/evidencia_02.png", 560, "Evidencia 2. Listado de incidentes con los datos semilla — GET /api/incidentes."),
  ...imagenCentrada("capturas/evidencia_03.png", 560, "Evidencia 3. Creación de un incidente nuevo — POST /api/incidentes (HTTP 201)."),
  ...imagenCentrada("capturas/evidencia_04.png", 560, "Evidencia 4. Consulta del incidente recién creado — GET /api/incidentes/:id."),
  ...imagenCentrada("capturas/evidencia_05.png", 560, "Evidencia 5. Actualización de estado y responsable — PUT /api/incidentes/:id."),
  ...imagenCentrada("capturas/evidencia_06.png", 560, "Evidencia 6. Filtrado por estado — GET /api/incidentes?estado=en_progreso."),
  ...imagenCentrada("capturas/evidencia_07.png", 560, "Evidencia 7. Validación de datos: petición sin campos obligatorios (HTTP 400)."),
  ...imagenCentrada("capturas/evidencia_08.png", 560, "Evidencia 8. Eliminación del incidente de prueba — DELETE /api/incidentes/:id (HTTP 200)."),
  ...imagenCentrada("capturas/evidencia_09.png", 560, "Evidencia 9. Confirmación de la eliminación — GET /api/incidentes/:id (HTTP 404)."),
];

// ---------------------------------------------------------------
// 7. REPOSITORIO
// ---------------------------------------------------------------
const seccion7 = [
  new Paragraph({ children: [new PageBreak()] }),
  tituloSeccion("Repositorio en GitHub", 7),
  parrafo(
    "El código del servidor se versionó con Git y se preparó en la rama feature/backend-api, tal como solicita la actividad. El repositorio incluye el código fuente completo, el esquema SQL, el archivo .env.example y este mismo README con las instrucciones de instalación."
  ),
  new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text: "Enlace al repositorio: ", bold: true, size: 22 }),
      new TextRun({ text: "[Reemplazar con el enlace de tu repositorio en GitHub tras subir el código]", italics: true, size: 22, color: "B45309" })],
  }),
  subtitulo("Rama"),
  codigoBloque(["feature/backend-api"]),
];

// ---------------------------------------------------------------
// 8. CONCLUSIÓN
// ---------------------------------------------------------------
const seccion8 = [
  tituloSeccion("Conclusión", 8),
  parrafo(
    "El desarrollo de esta actividad permitió construir un backend funcional para el Sistema de Gestión de Incidentes, con una arquitectura por capas que separa rutas, validación, controladores y acceso a datos. Las pruebas realizadas contra una base de datos PostgreSQL real confirman que las cinco operaciones CRUD funcionan correctamente, que las restricciones del dominio se validan antes de llegar a la base de datos, y que la API responde con los códigos HTTP adecuados tanto en los casos exitosos como en los de error. Este backend queda listo para integrarse con un cliente frontend en actividades posteriores del curso."
  ),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Desarrollo de Sistemas Informáticos — Actividad 8", size: 16, color: "94A3B8" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Página ", size: 16, color: "94A3B8" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "94A3B8" }),
          ],
        })],
      }),
    },
    children: [
      ...portada,
      ...seccion1,
      ...seccion2,
      ...seccion3,
      ...seccion4,
      ...seccion5,
      ...seccion6,
      ...seccion7,
      ...seccion8,
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(path.join(BASE, "erick_actividad8.docx"), buffer);
  console.log("Documento generado: erick_actividad8.docx");
});
