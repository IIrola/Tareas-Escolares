import { Router } from 'express';
import { verificarToken } from '../middleware/middleware';
import * as controller from '../controllers/materias.controller';

const router = Router();

// Crear materia
router.post('/', verificarToken, controller.crearMateria);

// Listar todas las materias (del usuario)
router.get('/', verificarToken, controller.obtenerTodasLasMaterias);

// Listar materias por periodo
router.get('/periodo/:id_periodo', verificarToken, controller.obtenerMateriasPorPeriodo);

// Obtener detalle de una materia
router.get('/:id', verificarToken, controller.obtenerMateriaPorId);

// Actualizar materia
router.put('/:id', verificarToken, controller.actualizarMateria);

// Eliminar materia
router.delete('/:id', verificarToken, controller.eliminarMateria);

export default router;