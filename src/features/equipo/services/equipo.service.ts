import { apiFetch, apiFetchFormData } from '@/shared/api/client';
import { EquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { CreateEquipoDto, UpdateEquipoDto } from '../dtos/equipo.dto';

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
        (data.sec_empleado ?? []).forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                const file = sec.image_file[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('sec_images', file);
            } else {
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });
        const slug = `${data.nombre_primero} ${data.apellido_paterno}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
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
            slug: slug,
            img_url: null,
            img_alt: data.img_alt || null,
            sec_empleado: (data.sec_empleado ?? []).map((sec, index) => ({
                nro_seccion: index,
                titulo_sec: sec.titulo_sec,
                contenido_sec: sec.contenido_sec,
                image_url: null,
                image_alt: sec.image_alt || null,
                image_position: sec.image_position || null,
            })),
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
        (data.sec_empleado ?? []).forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                const file = sec.image_file[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('sec_images', file);
            } else {
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });
        const slug = `${data.nombre_primero} ${data.apellido_paterno}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        const empleadoData = {
            id: id_empleado,
            nombre_primero: data.nombre_primero,
            nombre_segundo: data.nombre_segundo,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            profesion: data.profesion,
            especialidad: data.especialidad,
            descripcion: data.descripcion,
            orden: data.orden,
            activo: data.activo,
            slug: slug,
            img_url: hasNewFile ? null : (data.img_url ?? null),
            img_alt: data.img_alt || null,
            sec_empleado: (data.sec_empleado ?? []).map((sec, index) => {
                const hasNewSecFile = sec.image_file && sec.image_file.length > 0;
                return {
                    id: sec.id_sec || undefined,
                    nro_seccion: index,
                    titulo_sec: sec.titulo_sec,
                    contenido_sec: sec.contenido_sec,
                    image_url: hasNewSecFile ? null : (sec.image_url ?? null),
                    image_alt: sec.image_alt || null,
                    image_position: sec.image_position || null,
                };
            }),
        };
        formData.append('data', JSON.stringify(empleadoData));
        return await apiFetchFormData<EmpleadoEntity>(`equipo/empleado/editar/${id_empleado}`, formData, 'PATCH');
    }

    public static async deleteEmpleado(id_empleado: string): Promise<void> {
        return await apiFetch<void>(`equipo/empleado/eliminar/${id_empleado}`, 'DELETE');
    }

}
