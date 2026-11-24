import { apiFetch, apiFetchFormData } from '@/shared/api/client';
import { EquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { CreateEquipoDto, UpdateEquipoDto } from '../dtos/equipo.dto';

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
        return await apiFetch<EquipoEntity>(url, 'GET');
    }

    public static async createEquipo(data: CreateEquipoDto, proyectoId?: string): Promise<EquipoEntity> {
        const url = proyectoId ? `equipo/create?proyectoId=${proyectoId}` : 'equipo/create';
        return await apiFetch<EquipoEntity>(url, 'POST', data);
    }

    public static async updateEquipo(data: UpdateEquipoDto, proyectoId?: string): Promise<EquipoEntity> {
        const url = proyectoId ? `equipo/update?proyectoId=${proyectoId}` : 'equipo/update';
        return await apiFetch<EquipoEntity>(url, 'PATCH', data);
    }

    public static async createEmpleado(data: EmpleadoFormInput): Promise<EmpleadoEntity> {
        const formData = new FormData();
        if (data.imageFile && data.imageFile.length > 0) {
            const file = data.imageFile[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('imageFile', file);
        }
        (data.secEmpleado ?? []).forEach((sec, idx) => {
            if (sec.imageFile && sec.imageFile.length > 0) {
                const file = sec.imageFile[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('secImages', file);
            } else {
                formData.append('secImages', new File([], `empty-${idx}`));
            }
        });
        const slug = `${data.nombrePrimero} ${data.apellidoPaterno}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        const empleadoData = {
            nombrePrimero: data.nombrePrimero,
            nombreSegundo: data.nombreSegundo,
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno,
            profesion: data.profesion,
            especialidad: data.especialidad,
            descripcion: data.descripcion,
            orden: data.orden,
            activo: data.activo,
            slug: slug,
            imgUrl: null,
            imgAlt: data.imgAlt || null,
            secEmpleado: (data.secEmpleado ?? []).map((sec, index) => ({
                nroSeccion: index,
                tituloSec: sec.tituloSec,
                contenidoSec: sec.contenidoSec,
                imageUrl: null,
                imageAlt: sec.imageAlt || null,
                imagePosition: sec.imagePosition || null,
            })),
        };
        formData.append('data', JSON.stringify(empleadoData));
        return await apiFetchFormData<EmpleadoEntity>('equipo/empleado/create', formData, 'POST');
    }

    public static async getEmpleado(empleadoId: string): Promise<EmpleadoEntity> {
        return await apiFetch<EmpleadoEntity>(`equipo/empleado/view/${empleadoId}`, 'GET');
    }

    public static async updateEmpleado(empleadoId: string, data: EmpleadoFormInput): Promise<EmpleadoEntity> {
        const formData = new FormData();
        const hasNewFile = data.imageFile && data.imageFile.length > 0;
        if (hasNewFile) {
            const file = data.imageFile![0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('imageFile', file);
        }
        (data.secEmpleado ?? []).forEach((sec, idx) => {
            if (sec.imageFile && sec.imageFile.length > 0) {
                const file = sec.imageFile[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('secImages', file);
            } else {
                formData.append('secImages', new File([], `empty-${idx}`));
            }
        });
        const slug = `${data.nombrePrimero} ${data.apellidoPaterno}`
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        const empleadoData = {
            id: empleadoId,
            nombrePrimero: data.nombrePrimero,
            nombreSegundo: data.nombreSegundo,
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno,
            profesion: data.profesion,
            especialidad: data.especialidad,
            descripcion: data.descripcion,
            orden: data.orden,
            activo: data.activo,
            slug: slug,
            imgUrl: hasNewFile ? null : (data.imgUrl ?? null),
            imgAlt: data.imgAlt || null,
            secEmpleado: (data.secEmpleado ?? []).map((sec, index) => {
                const hasNewSecFile = sec.imageFile && sec.imageFile.length > 0;
                return {
                    id: sec.idSec || undefined,
                    nroSeccion: index,
                    tituloSec: sec.tituloSec,
                    contenidoSec: sec.contenidoSec,
                    imageUrl: hasNewSecFile ? null : (sec.imageUrl ?? null),
                    imageAlt: sec.imageAlt || null,
                    imagePosition: sec.imagePosition || null,
                };
            }),
        };
        formData.append('data', JSON.stringify(empleadoData));
        return await apiFetchFormData<EmpleadoEntity>(`equipo/empleado/update/${empleadoId}`, formData, 'PUT');
    }

    public static async updateEmpleadoOrden(id: string, orden: number): Promise<EmpleadoEntity> {
        const data = {
            id: id,
            orden: orden
        }
        return await apiFetch<EmpleadoEntity>(`equipo/empleado/update/order/${id}`, 'PATCH', data);
    }

    public static async deleteEmpleado(empleadoId: string): Promise<void> {
        return await apiFetch<void>(`equipo/empleado/delete/${empleadoId}`, 'DELETE');
    }

}
