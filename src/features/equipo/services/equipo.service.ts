import { apiFetch, apiFetchFormData } from '@/shared/api/client';
import { EquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { CreateEquipoDto, UpdateEquipoDto } from '../dtos/equipo.dto';

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
}

export class EquipoService {

    public static async getEquipo(proyecto_id?: string): Promise<EquipoEntity | null> {
        const url = proyecto_id ? `equipo/ver-todo?proyecto_id=${proyecto_id}` : 'equipo/ver-todo';
        return await apiFetch<EquipoEntity>(url, 'GET');
    }

    public static async createEquipo(data: CreateEquipoDto, proyecto_id?: string): Promise<EquipoEntity> {
        const url = proyecto_id ? `equipo/crear?proyecto_id=${proyecto_id}` : 'equipo/crear';
        return await apiFetch<EquipoEntity>(url, 'POST', data);
    }

    public static async updateEquipo(data: UpdateEquipoDto, proyecto_id?: string): Promise<EquipoEntity> {
        const url = proyecto_id ? `equipo/editar?proyecto_id=${proyecto_id}` : 'equipo/editar';
        return await apiFetch<EquipoEntity>(url, 'PATCH', data);
    }

    public static async createEmpleado(data: EmpleadoFormInput): Promise<EmpleadoEntity> {
        const formData = new FormData();
        if (data.image_file && data.image_file.length > 0) {
            const file = data.image_file[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('image_file', file);
        }
        const empleadoData = {
            nombre_primero: data.nombre_primero,
            nombre_segundo: data.nombre_segundo,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            profesion: data.profesion,
            especialidad: data.especialidad,
            descripcion: data.descripcion,
            orden: data.orden,
            activo: data.activo,
            img_url: null,
            img_alt: data.img_alt || null,
            slug: data.slug || null,
        };
        formData.append('data', JSON.stringify(empleadoData));
        return await apiFetchFormData<EmpleadoEntity>('equipo/empleado/crear', formData, 'POST');
    }

    public static async getEmpleado(id_empleado: string): Promise<EmpleadoEntity> {
        return await apiFetch<EmpleadoEntity>(`equipo/empleado/ver/${id_empleado}`, 'GET');
    }

    public static async updateEmpleado(id_empleado: string, data: EmpleadoFormInput): Promise<EmpleadoEntity> {
        const formData = new FormData();
        const hasNewFile = data.image_file && data.image_file.length > 0;
        if (hasNewFile) {
            const file = data.image_file![0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('image_file', file);
        }
        const empleadoData = {
            nombre_primero: data.nombre_primero,
            nombre_segundo: data.nombre_segundo,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            profesion: data.profesion,
            especialidad: data.especialidad,
            descripcion: data.descripcion,
            orden: data.orden,
            activo: data.activo,
            img_url: hasNewFile ? null : (data.img_url ?? null),
            img_alt: data.img_alt || null,
            slug: data.slug || null,
        };
        formData.append('data', JSON.stringify(empleadoData));
        return await apiFetchFormData<EmpleadoEntity>(`equipo/empleado/editar/${id_empleado}`, formData, 'PATCH');
    }

    public static async deleteEmpleado(id_empleado: string): Promise<void> {
        return await apiFetch<void>(`equipo/empleado/eliminar/${id_empleado}`, 'DELETE');
    }

}
