import { apiFetchServer } from '@/shared/api/client-server';
import { EquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';

export interface SecEmpleadoFormInput {
    id_sec?: string;
    titulo_sec: string;
    contenido_sec: string;
    image_file?: FileList;
    image_url?: string | null;
    image_alt?: string;
    image_position?: string;
}

export interface EmpleadoFormInput {
    nombre_primero: string;
    nombre_segundo: string | null;
    apellido_paterno: string;
    apellido_materno: string | null;
    profesion: string;
    especialidad: string | null;
    descripcion: string | null;
    orden: string | null;
    activo: boolean;
    img_url?: string | null;
    img_alt?: string | null;
    slug?: string | null;
    image_file?: FileList;
    sec_empleado?: SecEmpleadoFormInput[];
}

export class EquipoService {

    public static async getEquipo(proyecto_id?: string): Promise<EquipoEntity | null> {
        const url = proyecto_id ? `equipo/ver-todo?proyecto_id=${proyecto_id}` : 'equipo/ver-todo';
        return await apiFetchServer<EquipoEntity>(url, 'GET');
    }

    public static async getEmpleado(id_empleado: string): Promise<EmpleadoEntity> {
        return await apiFetchServer<EmpleadoEntity>(`equipo/empleado/ver/${id_empleado}`, 'GET');
    }

}
