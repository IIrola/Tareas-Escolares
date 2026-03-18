export interface User {
  id: number;
  nombre: string;
  correo: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: User;
}

export interface Periodo {
  id_periodo: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_usuario: number;
}

export interface Materia {
  id_materia: number;
  nombre: string;
  profesor: string;
  id_periodo: number;
  periodo?: string; // nombre del periodo (JOIN alias)
}

export interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string;
  fecha_entrega: string;
  completada: boolean;
  id_materia: number;
  materia?: string; // nombre de la materia (JOIN alias)
}

export interface Horario {
  id_horario: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  id_materia: number;
  materia?: string;  // nombre de la materia (JOIN alias)
  periodo?: string;  // nombre del periodo (JOIN alias)
}
