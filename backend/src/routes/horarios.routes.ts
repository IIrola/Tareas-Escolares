import { Router } from 'express';
import { verificarToken } from '../middleware/middleware';
import * as controller from '../controllers/horarios.controller';

const router = Router();

// Crear horario
router.post('/', verificarToken, controller.crearHorario);

// Listar horarios por materia
router.get('/materia/:id_materia', verificarToken, controller.obtenerHorariosPorMateria);

// Listar horario completo (del usuario)
router.get('/', verificarToken, controller.obtenerHorarioCompleto);

// Actualizar horario
router.put('/:id', verificarToken, controller.actualizarHorario);

// Eliminar horario
router.delete('/:id', verificarToken, controller.eliminarHorario);

export default router;
