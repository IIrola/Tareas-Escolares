import pool from '../config/db';

export const crearPeriodo = async (req: any, res: any) => {
    const { nombre, fecha_inicio, fecha_fin } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!nombre || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({ error: 'Nombre, fecha_inicio y fecha_fin son obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO periodos (nombre, fecha_inicio, fecha_fin, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, fecha_inicio, fecha_fin, id_usuario]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el periodo' });
    }
};

export const obtenerPeriodos = async (req: any, res: any) => {
    const id_usuario = req.usuario.id_usuario;

    try {
        const result = await pool.query(
            `SELECT * FROM periodos
       WHERE id_usuario = $1
       ORDER BY fecha_inicio DESC`,
            [id_usuario]
        );

        res.json(result.rows);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPeriodo = async (req: any, res: any) => {
    const id_usuario = req.usuario.id_usuario;
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM periodos
       WHERE id_usuario = $1 AND id_periodo = $2
       ORDER BY fecha_inicio DESC`,
            [id_usuario, id]
        );

        res.json(result.rows);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPeriodo = async (req: any, res: any) => {
    const { id } = req.params;
    const { nombre, fecha_inicio, fecha_fin } = req.body;
    const id_usuario = req.usuario.id_usuario;

    try {
        const result = await pool.query(
            `UPDATE periodos
       SET nombre = $1,
           fecha_inicio = $2,
           fecha_fin = $3
       WHERE id_periodo = $4 AND id_usuario = $5
       RETURNING *`,
            [nombre, fecha_inicio, fecha_fin, id, id_usuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Periodo no encontrado o no autorizado'
            });
        }

        res.json(result.rows[0]);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarPeriodo = async (req: any, res: any) => {
    const { id } = req.params;
    const id_usuario = req.usuario.id_usuario;

    try {
        const result = await pool.query(
            `DELETE FROM periodos
       WHERE id_periodo = $1 AND id_usuario = $2
       RETURNING *`,
            [id, id_usuario]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Periodo no encontrado o no autorizado'
            });
        }

        res.json({
            message: 'Periodo eliminado correctamente'
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

