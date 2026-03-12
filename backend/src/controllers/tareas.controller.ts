import { Request, Response } from 'express';
import pool from '../config/db';

/**
 * ==============================
 * CREAR TAREA
 * ==============================
 */
export const crearTarea = async (req: any, res: Response) => {
  const { titulo, descripcion, fecha_entrega, id_materia } = req.body;
  const id_usuario = req.usuario.id_usuario;

  if (!titulo || !fecha_entrega || !id_materia) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try {
    // Validar que la materia pertenece al usuario
    const materia = await pool.query(
      `SELECT m.*
       FROM materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE m.id_materia = $1 AND p.id_usuario = $2`,
      [id_materia, id_usuario]
    );

    if (materia.rows.length === 0) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const result = await pool.query(
      `INSERT INTO tareas (titulo, descripcion, fecha_entrega, id_materia)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titulo, descripcion, fecha_entrega, id_materia]
    );

    res.status(201).json(result.rows[0]);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * LISTAR TODAS LAS TAREAS
 * ==============================
 */
export const obtenerTodasLasTareas = async (req: any, res: Response) => {
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `SELECT t.*, m.nombre AS materia
       FROM tareas t
       JOIN materias m ON t.id_materia = m.id_materia
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE p.id_usuario = $1
       ORDER BY t.fecha_entrega ASC`,
      [id_usuario]
    );

    res.json(result.rows);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * MARCAR COMO COMPLETADA
 * ==============================
 */
export const marcarComoCompletada = async (req: any, res: Response) => {
  const { id } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `UPDATE tareas t
       SET completada = TRUE
       FROM materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE t.id_tarea = $1
         AND t.id_materia = m.id_materia
         AND p.id_usuario = $2
       RETURNING t.*`,
      [id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(result.rows[0]);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * OBTENER TAREA POR ID
 * ==============================
 */
export const obtenerTareaPorId = async (req: any, res: Response) => {
  const { id } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `SELECT t.*, m.nombre AS materia
       FROM tareas t
       JOIN materias m ON t.id_materia = m.id_materia
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE t.id_tarea = $1
         AND p.id_usuario = $2`,
      [id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(result.rows[0]);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * ACTUALIZAR TAREA
 * ==============================
 */
export const actualizarTarea = async (req: any, res: Response) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_entrega } = req.body;
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `UPDATE tareas t
       SET titulo = $1,
           descripcion = $2,
           fecha_entrega = $3
       FROM materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE t.id_tarea = $4
         AND t.id_materia = m.id_materia
         AND p.id_usuario = $5
       RETURNING t.*`,
      [titulo, descripcion, fecha_entrega, id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    }

    res.json(result.rows[0]);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * ELIMINAR TAREA
 * ==============================
 */
export const eliminarTarea = async (req: any, res: Response) => {
  const { id } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `DELETE FROM tareas t
       USING materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE t.id_tarea = $1
         AND t.id_materia = m.id_materia
         AND p.id_usuario = $2
       RETURNING t.*`,
      [id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * CONSULTAS ESPECIALES
 *  => TAREAS PENDIENTES
 * ==============================
 */
 export const tareasPendientes = async (req: any, res: Response) => {
  const id_usuario = req.usuario.id_usuario;
  try {
    const result = await pool.query(
      `SELECT t.*, m.nombre AS materia
       FROM tareas t
       JOIN materias m ON t.id_materia = m.id_materia
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE p.id_usuario = $1
         AND t.completada = FALSE
         AND t.fecha_entrega >= CURRENT_DATE
       ORDER BY t.fecha_entrega ASC`,
      [id_usuario]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * CONSULTAS ESPECIALES
 *  => TAREAS VENCIDAS
 * ==============================
 */
 export const tareasVencidas = async (req: any, res: Response) => {
  const id_usuario = req.usuario.id_usuario;
  try {
    const result = await pool.query(
      `SELECT t.*, m.nombre AS materia
       FROM tareas t
       JOIN materias m ON t.id_materia = m.id_materia
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE p.id_usuario = $1
         AND t.completada = FALSE
         AND t.fecha_entrega < CURRENT_DATE
       ORDER BY t.fecha_entrega ASC`,
      [id_usuario]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * CONSULTAS ESPECIALES
 *  => TAREAS COMPLETADAS
 * ==============================
 */
 export const tareasCompletadas = async (req: any, res: Response) => {
  const id_usuario = req.usuario.id_usuario;
  try {
    const result = await pool.query(
      `SELECT t.*, m.nombre AS materia
       FROM tareas t
       JOIN materias m ON t.id_materia = m.id_materia
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE p.id_usuario = $1
         AND t.completada = TRUE
       ORDER BY t.fecha_entrega DESC`,
      [id_usuario]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
