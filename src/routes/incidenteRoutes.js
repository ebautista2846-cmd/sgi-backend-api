const { Router } = require('express');
const controlador = require('../controllers/incidenteController');
const { reglasCrear, reglasActualizar, reglasId, reglasFiltros } = require('../middleware/validarIncidente');

const router = Router();

// GET    /api/incidentes           -> lista todos (admite filtros ?estado= &prioridad=)
// GET    /api/incidentes/:id       -> obtiene un incidente puntual
// POST   /api/incidentes           -> crea un incidente nuevo
// PUT    /api/incidentes/:id       -> actualiza un incidente existente
// DELETE /api/incidentes/:id       -> elimina un incidente

router.get('/', reglasFiltros, controlador.listar);
router.get('/:id', reglasId, controlador.obtener);
router.post('/', reglasCrear, controlador.crear);
router.put('/:id', reglasActualizar, controlador.actualizar);
router.delete('/:id', reglasId, controlador.eliminar);

module.exports = router;
