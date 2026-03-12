import { Router } from 'express';
import { verificarToken } from '../middleware/middleware';
import * as controller from '../controllers/tareas.controller';

const router = Router();

// Crear tarea
router.post('/', verificarToken, controller.crearTarea);

// Listar todas las tareas (del usuario)
router.get('/', verificarToken, controller.obtenerTodasLasTareas);

// Consultas especiales por estado (deben ir antes de /:id para evitar conflictos)
router.get('/estado/pendientes', verificarToken, controller.tareasPendientes);
router.get('/estado/vencidas', verificarToken, controller.tareasVencidas);
router.get('/estado/completadas', verificarToken, controller.tareasCompletadas);

// Obtener detalle de una tarea
router.get('/:id', verificarToken, controller.obtenerTareaPorId);

// Actualizar tarea
router.put('/:id', verificarToken, controller.actualizarTarea);

// Marcar como completada
router.patch('/:id/completar', verificarToken, controller.marcarComoCompletada);

// Eliminar tarea
router.delete('/:id', verificarToken, controller.eliminarTarea);

export default router;
