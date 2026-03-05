import express from 'express';
import * as mid from '../middleware/middleware';

const router = express.Router();

// Ejemplo de ruta protegida
router.get('/', mid.verificarToken, (req: any, res: any) => {
  res.json({
    message: 'Ruta protegida',
    usuario: req.usuario
  });
});

export default router;
