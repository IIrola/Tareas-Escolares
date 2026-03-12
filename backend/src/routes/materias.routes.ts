import { Router } from 'express';
import * as controller from '../controllers/materias.controller';
import { verificarToken } from '../middleware/middleware';

export const router = Router();

router.post('/', verificarToken, controller.crearMateria);

// Listar todas las materias
router.get('/', verificarToken, controller.obtenerTodasLasMaterias);

// Listar materias por periodo
router.get('/:id_periodo', verificarToken, controller.obtenerMateriasPorPeriodo);

// Obtener detalle de una materia
router.get('/detalle/:id', verificarToken, controller.obtenerMateriaPorId);

// Actualizar materia
router.put('/:id', verificarToken, controller.actualizarMateria);

// Eliminar materia
router.delete('/:id', verificarToken, controller.eliminarMateria);

export default router;