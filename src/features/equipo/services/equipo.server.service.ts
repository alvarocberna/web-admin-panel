import { apiFetchServer } from '@/shared/api/client-server';
import { EquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';

export interface SecEmpleadoFormInput {
    idSec?: string;
    tituloSec: string;
    contenidoSec: string;
    imageFile?: FileList;
    imageUrl?: string | null;
    imageAlt?: string;
    imagePosition?: string;
}

export interface EmpleadoFormInput {
    nombrePrimero: string;
    nombreSegundo: string | null;
    apellidoPaterno: string;
    apellidoMaterno: string | null;
    profesion: string;
    especialidad: string | null;
    descripcion: string | null;
    orden: string | null;
    activo: boolean;
    imgUrl?: string | null;
    imgAlt?: string | null;
    slug?: string | null;
    imageFile?: FileList;
    secEmpleado?: SecEmpleadoFormInput[];
}

export class EquipoService {

    public static async getEquipo(proyectoId?: string): Promise<EquipoEntity | null> {
        const url = proyectoId ? `equipo/all?proyectoId=${proyectoId}` : 'equipo/all';
        return await apiFetchServer<EquipoEntity>(url, 'GET');
    }

    public static async getEmpleado(empleadoId: string): Promise<EmpleadoEntity> {
        return await apiFetchServer<EmpleadoEntity>(`equipo/empleado/view/${empleadoId}`, 'GET');
    }

}
