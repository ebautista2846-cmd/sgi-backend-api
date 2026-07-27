# Sistema de Gestión de Incidentes (SGI) — API REST

Backend del Sistema de Gestión de Incidentes, desarrollado como parte de la
Unidad 4 de Desarrollo de Sistemas Informáticos (UTM). Expone una API RESTful
para la gestión de tickets/incidentes de una mesa de ayuda (help desk).

## Stack tecnológico

- **Node.js** + **Express** — servidor y enrutamiento HTTP
- **PostgreSQL** — base de datos relacional
- **pg** — driver nativo de PostgreSQL para Node.js (consultas parametrizadas)
- **express-validator** — validación y sanitización de datos de entrada
- **helmet**, **cors**, **compression**, **morgan** — seguridad, CORS, compresión y logging

## Estructura del proyecto

```
incidentes-backend/
├── server.js                    # Punto de entrada, arranque del servidor
├── db/
│   └── schema.sql                # DDL: tabla, índices, trigger y datos semilla
├── src/
│   ├── app.js                    # Configuración de Express y middlewares globales
│   ├── config/db.js              # Pool de conexión a PostgreSQL
│   ├── models/incidenteModel.js  # Acceso a datos (SQL parametrizado)
│   ├── controllers/incidenteController.js
│   ├── routes/incidenteRoutes.js
│   └── middleware/
│       ├── validarIncidente.js   # Reglas de validación (express-validator)
│       └── manejadorErrores.js   # Manejo centralizado de errores y 404
└── evidencias/                   # Capturas de las pruebas de conectividad
```

## Instalación y ejecución local

```bash
npm install
cp .env.example .env        # y completar las credenciales de PostgreSQL
psql -U postgres -f db/schema.sql
npm start
```

El servidor queda escuchando en `http://localhost:3000`.

## Endpoints

| Método | Ruta                     | Descripción                                   |
|--------|--------------------------|------------------------------------------------|
| GET    | `/api/salud`             | Verifica que la API esté operativa             |
| GET    | `/api/incidentes`        | Lista incidentes (filtros `?estado=` `?prioridad=`) |
| GET    | `/api/incidentes/:id`    | Obtiene un incidente por id                    |
| POST   | `/api/incidentes`        | Crea un incidente nuevo                        |
| PUT    | `/api/incidentes/:id`    | Actualiza un incidente existente               |
| DELETE | `/api/incidentes/:id`    | Elimina un incidente                           |

## Pruebas

Las pruebas de conectividad de todas las rutas (creación, lectura, actualización,
filtrado, validación de errores y eliminación) se ejecutaron con `curl` contra
el servidor en ejecución y su evidencia se encuentra en `evidencias/`.
