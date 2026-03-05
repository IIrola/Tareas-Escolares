import bcrypt from 'bcrypt';
import pool from '../config/db';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config();

/*
 * ==============================
 * REGISTRO
 * ==============================
 */
exports.register = async (req: any, res: any) => {

  if (!req.body) {
    return res.status(400).json({ error: 'Body requerido en formato JSON' });
  }

  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      error: 'Nombre, correo y password son obligatorios'
    });
  }

  try {

    // 1. Encriptar password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 2.  Insertar usuario con password encriptado
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password) VALUES ($1, $2, $3) RETURNING id_usuario, nombre, correo',
      [nombre, correo.toLowerCase(), passwordHash]
    );

    res.status(201).json(result.rows[0]);

  } catch (error: any) {

    if (error.code === '23505') {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    res.status(500).json({ error: error.message });
  }
};


/**
 * ==============================
 * LOGIN CON JWT
 * ==============================
 */
exports.login = async (req: any, res: any) => {
const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({
      error: 'Correo y password son obligatorios'
    });
  }

  try {

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const usuario = result.rows[0];

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    //  GENERAR TOKEN
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo
      },
        process.env.JWT_SECRET as string,
      {
        expiresIn: '2h'
      }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export function register(arg0: string, register: any) {
    throw new Error('Function not implemented.');
}


export function login(arg0: string, register: any) {
    throw new Error('Function not implemented.');
}
