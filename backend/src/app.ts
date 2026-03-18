import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import periodRoutes from './routes/periodos.routes';
import materiasRoutes from './routes/materias.routes';
import tareasRoutes from './routes/tareas.routes';
import horariosRoutes from './routes/horarios.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/periodos', periodRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/horarios', horariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT} (0.0.0.0)`);
});
