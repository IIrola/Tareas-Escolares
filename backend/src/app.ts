import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import periodRoutes from './routes/periodos.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/periodos', periodRoutes);
//app.use('/api/periodos', require('./routes/periodos.routes'));
//app.use('/api/materias', require('./routes/materias.routes'));
//app.use('/api/horarios', require('./routes/horarios.routes'));
//app.use('/api/tareas', require('./routes/tareas.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
