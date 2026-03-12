Implementación de materias
Endpoints
POST    /api/materias
GET     /api/materias/:id_periodo
GET     /api/materias/detalle/:id
PUT     /api/materias/:id
DELETE  /api/materias/:id

routes/materias.routes.js
const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/materias.controller');

// Crear materia
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

module.exports = router;




controller/materias.controller.js
const pool = require('../config/db');

/**
 * ==============================
 * CREAR MATERIA
 * ==============================
 */
exports.crearMateria = async (req, res) => {
  const { nombre, profesor, id_periodo } = req.body;
  const id_usuario = req.usuario.id_usuario;

  if (!nombre || !id_periodo) {
    return res.status(400).json({
      error: 'Nombre e id_periodo son obligatorios'
    });
  }

  try {

    //  Validar que el periodo pertenece al usuario
    const periodo = await pool.query(
      `SELECT * FROM periodos
       WHERE id_periodo = $1 AND id_usuario = $2`,
      [id_periodo, id_usuario]
    );

    if (periodo.rows.length === 0) {
      return res.status(403).json({
        error: 'No autorizado para usar este periodo'
      });
    }

    const result = await pool.query(
      `INSERT INTO materias (nombre, profesor, id_periodo)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, profesor, id_periodo]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * LISTAR TODAS LAS MATERIAS DEL USUARIO
 * ==============================
 */
exports.obtenerTodasLasMaterias = async (req, res) => {
  const id_usuario = req.usuario.id_usuario;

  try {

    const result = await pool.query(
      `SELECT m.id_materia,
              m.nombre,
              m.profesor,
              p.id_periodo,
              p.nombre AS periodo
       FROM materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE p.id_usuario = $1
       ORDER BY p.fecha_inicio DESC, m.nombre ASC`,
      [id_usuario]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * LISTAR MATERIAS POR PERIODO
 * ==============================
 */
exports.obtenerMateriasPorPeriodo = async (req, res) => {
  const { id_periodo } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {

    // Validar que el periodo pertenece al usuario
    const periodo = await pool.query(
      `SELECT * FROM periodos
       WHERE id_periodo = $1 AND id_usuario = $2`,
      [id_periodo, id_usuario]
    );

    if (periodo.rows.length === 0) {
      return res.status(403).json({
        error: 'No autorizado'
      });
    }

    const result = await pool.query(
      `SELECT * FROM materias
       WHERE id_periodo = $1
       ORDER BY nombre ASC`,
      [id_periodo]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * OBTENER MATERIA POR ID
 * ==============================
 */
exports.obtenerMateriaPorId = async (req, res) => {
  const { id } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {

    const result = await pool.query(
      `SELECT m.*
       FROM materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE m.id_materia = $1 AND p.id_usuario = $2`,
      [id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Materia no encontrada'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * ACTUALIZAR MATERIA
 * ==============================
 */
exports.actualizarMateria = async (req, res) => {
  const { id } = req.params;
  const { nombre, profesor } = req.body;
  const id_usuario = req.usuario.id_usuario;

  try {

    const result = await pool.query(
      `UPDATE materias m
       SET nombre = $1,
           profesor = $2
       FROM periodos p
       WHERE m.id_materia = $3
         AND m.id_periodo = p.id_periodo
         AND p.id_usuario = $4
       RETURNING m.*`,
      [nombre, profesor, id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Materia no encontrada o no autorizada'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * ELIMINAR MATERIA
 * ==============================
 */
exports.eliminarMateria = async (req, res) => {
  const { id } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {

    const result = await pool.query(
      `DELETE FROM materias m
       USING periodos p
       WHERE m.id_materia = $1
         AND m.id_periodo = p.id_periodo
         AND p.id_usuario = $2
       RETURNING m.*`,
      [id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Materia no encontrada o no autorizada'
      });
    }

    res.json({
      message: 'Materia eliminada correctamente'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




Implementación de tareas
(La esencia del proyecto)

Requerimientos para las tareas
Usuario actual
Periodo Válido
Tener materias en el periodo

Con que materia esta asocidada
Titulo
Actividad
Fecha y hora de entrega
Status de las tareas
Pendientes
Vecindad
Entregadas


src/routes/tareas.routes.js
const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/tareas.controller');

router.post('/', verificarToken, controller.crearTarea);

router.get('/', verificarToken, controller.obtenerTodasLasTareas);

router.get('/:id', verificarToken, controller.obtenerTareaPorId);

router.put('/:id', verificarToken, controller.actualizarTarea);

router.patch('/:id/completar', verificarToken, controller.marcarComoCompletada);

router.delete('/:id', verificarToken, controller.eliminarTarea);


router.get('/estado/pendientes', verificarToken, controller.tareasPendientes);
router.get('/estado/vencidas', verificarToken, controller.tareasVencidas);
router.get('/estado/completadas', verificarToken, controller.tareasCompletadas);


module.exports = router;




Agregar toda la funcionalidad de los endpoints a las tareas
src/controllers/tareas.controller.js
const pool = require('../config/db');

/**
 * ==============================
 * CREAR TAREA
 * ==============================
 */
exports.crearTarea = async (req, res) => {
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * LISTAR TODAS LAS TAREAS
 * ==============================
 */
exports.obtenerTodasLasTareas = async (req, res) => {
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * MARCAR COMO COMPLETADA
 * ==============================
 */
exports.marcarComoCompletada = async (req, res) => {
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * OBTENER TAREA POR ID
 * ==============================
 */
exports.obtenerTareaPorId = async (req, res) => {
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * ACTUALIZAR TAREA
 * ==============================
 */
exports.actualizarTarea = async (req, res) => {
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * ELIMINAR TAREA
 * ==============================
 */
exports.eliminarTarea = async (req, res) => {
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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ==============================
 * CONSULTAS ESPECIALES
 *  => TAREAS PENDIENTES
 * ==============================
 */
 exports.tareasPendientes = async (req, res) => {
  const id_usuario = req.usuario.id_usuario;

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
};

/**
 * ==============================
 * CONSULTAS ESPECIALES
 *  => TAREAS VENCIDAS
 * ==============================
 */
 exports.tareasVencidas = async (req, res) => {
  const id_usuario = req.usuario.id_usuario;

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
};


/**
 * ==============================
 * CONSULTAS ESPECIALES
 *  => TAREAS COMPLETADAS
 * ==============================
 */
 exports.tareasCompletadas = async (req, res) => {
  const id_usuario = req.usuario.id_usuario;

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
};



Implementación de horarios

Requerimientos para los horarios:
Usuario logueado
Tener una materia dada de alta con el usuario actual


src/routes/horarios.routes,js
const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/horarios.controller');

router.post('/', verificarToken, controller.crearHorario);
router.get('/materia/:id_materia', verificarToken, controller.obtenerHorariosPorMateria);
router.get('/', verificarToken, controller.obtenerHorarioCompleto);
router.put('/:id', verificarToken, controller.actualizarHorario);
router.delete('/:id', verificarToken, controller.eliminarHorario);

module.exports = router;




src/controllers/horarios.controller.js
const pool = require('../config/db');

/**
 * ==============================
 * CREAR HORARIO
 * ==============================
 */
exports.crearHorario = async (req, res) => {
  const { dia_semana, hora_inicio, hora_fin, id_materia } = req.body;
  const id_usuario = req.usuario.id_usuario;

  if (!dia_semana || !hora_inicio || !hora_fin || !id_materia) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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
      `INSERT INTO horarios (dia_semana, hora_inicio, hora_fin, id_materia)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [dia_semana, hora_inicio, hora_fin, id_materia]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * LISTAR HORARIOS POR MATERIA
 * ==============================
 */
exports.obtenerHorariosPorMateria = async (req, res) => {
  const { id_materia } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `SELECT h.*
       FROM horarios h
       JOIN materias m ON h.id_materia = m.id_materia
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE m.id_materia = $1 AND p.id_usuario = $2
       ORDER BY h.dia_semana, h.hora_inicio`,
      [id_materia, id_usuario]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * LISTAR HORARIO COMPLETO
 * ==============================
 */
exports.obtenerHorarioCompleto = async (req, res) => {
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `SELECT h.*, m.nombre AS materia, p.nombre AS periodo
       FROM horarios h
       JOIN materias m ON h.id_materia = m.id_materia
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE p.id_usuario = $1
       ORDER BY h.dia_semana, h.hora_inicio`,
      [id_usuario]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * ACTUALIZAR HORARIO
 * ==============================
 */
exports.actualizarHorario = async (req, res) => {
  const { id } = req.params;
  const { dia_semana, hora_inicio, hora_fin } = req.body;
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `UPDATE horarios h
       SET dia_semana = $1,
           hora_inicio = $2,
           hora_fin = $3
       FROM materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE h.id_horario = $4
         AND h.id_materia = m.id_materia
         AND p.id_usuario = $5
       RETURNING h.*`,
      [dia_semana, hora_inicio, hora_fin, id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * ELIMINAR HORARIO
 * ==============================
 */
exports.eliminarHorario = async (req, res) => {
  const { id } = req.params;
  const id_usuario = req.usuario.id_usuario;

  try {
    const result = await pool.query(
      `DELETE FROM horarios h
       USING materias m
       JOIN periodos p ON m.id_periodo = p.id_periodo
       WHERE h.id_horario = $1
         AND h.id_materia = m.id_materia
         AND p.id_usuario = $2
       RETURNING h.*`,
      [id, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



