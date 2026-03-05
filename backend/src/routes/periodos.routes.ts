import express from 'express';
import * as mid from '../middleware/middleware';
import * as period from '../controllers/periodos.controller';

const router = express.Router();

// Ejemplo de ruta protegida
router.get('/', mid.verificarToken, period.obtenerPeriodos);

router.post('/', mid.verificarToken, period.crearPeriodo);

router.get('/:id', mid.verificarToken, period.obtenerPeriodo);

router.delete('/:id', mid.verificarToken, period.eliminarPeriodo);

router.put('/:id', mid.verificarToken, period.actualizarPeriodo);

export default router;
