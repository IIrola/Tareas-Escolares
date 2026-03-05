import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config();

export const verificarToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.usuario = decoded;
    next();
  } catch (error: any) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

