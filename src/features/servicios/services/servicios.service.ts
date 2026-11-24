import { apiFetch, apiFetchFormData } from '@/shared/api/client';
import { ServiciosEntity } from '../entities/servicios.entity';
import { ServicioEntity } from '../entities/servicio.entity';
import { CreateServiciosDto, UpdateServiciosDto } from '../dtos/servicios.dto';

export interface SecServicioFormInput {
    idSec?: string;
    tituloSec: string;
    contenidoSec: string;
    imageFile?: FileList;
    imageUrl?: string | null;
    imageAlt?: string;
    imagePosition?: string;
}

export interface ServicioFormInput {
    nombreServicio: string;
    descripcion: string | null;
    valor: number | null;
    nombrePromocion: string | null;
    porcentajeDescuento: number | null;
    destacado: boolean | null;
    icono: string | null;
    orden: string | null;
    activo: boolean;
    imgUrl?: string | null;
    imgAlt?: string | null;
    imageFile?: FileList;
    secServicio?: SecServicioFormInput[];
}

export class ServiciosService {

    public static async createServicios(data: CreateServiciosDto, proyectoId?: string): Promise<ServiciosEntity> {
        const url = proyectoId ? `servicios/create?proyectoId=${proyectoId}` : 'servicios/create';
        return await apiFetch<ServiciosEntity>(url, 'POST', data);
    }

    public static async getServicios(proyectoId?: string): Promise<ServiciosEntity | null> {
        const url = proyectoId ? `servicios/all?proyectoId=${proyectoId}` : 'servicios/all';
        return await apiFetch<ServiciosEntity>(url, 'GET');
    }

    public static async updateServicios(data: UpdateServiciosDto, proyectoId?: string): Promise<ServiciosEntity> {
        const url = proyectoId ? `servicios/update?proyectoId=${proyectoId}` : 'servicios/update';
        return await apiFetch<ServiciosEntity>(url, 'PATCH', data);
    }

    public static async createServicio(data: ServicioFormInput): Promise<ServicioEntity> {
        const formData = new FormData();
        if (data.imageFile && data.imageFile.length > 0) {
            const file = data.imageFile[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('imageFile', file);
        }
        (data.secServicio ?? []).forEach((sec, idx) => {
            if (sec.imageFile && sec.imageFile.length > 0) {
                const file = sec.imageFile[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('secImages', file);
            } else {
                formData.append('secImages', new File([], `empty-${idx}`));
            }
        });
        const slug = data.nombreServicio
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        const servicioData = {
            nombreServicio: data.nombreServicio,
            descripcion: data.descripcion,
            valor: data.valor,
            nombrePromocion: data.nombrePromocion,
            porcentajeDescuento: data.porcentajeDescuento,
            destacado: data.destacado,
            icono: data.icono,
            orden: data.orden,
            activo: data.activo,
            slug: slug,
            imgUrl: null,
            imgAlt: data.imgAlt || null,
            secServicio: (data.secServicio ?? []).map((sec, index) => ({
                nroSeccion: index,
                tituloSec: sec.tituloSec,
                contenidoSec: sec.contenidoSec,
                imageUrl: null,
                imageAlt: sec.imageAlt || null,
                imagePosition: sec.imagePosition || null,
            })),
        };
        formData.append('data', JSON.stringify(servicioData));
        return await apiFetchFormData<ServicioEntity>('servicios/servicio/create', formData, 'POST');
    }

    public static async getServicio(servicioId: string): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>(`servicios/servicio/view/${servicioId}`, 'GET');
    }

    public static async updateServicio(servicioId: string, data: ServicioFormInput): Promise<ServicioEntity> {
        const formData = new FormData();
        const hasNewFile = data.imageFile && data.imageFile.length > 0;
        if (hasNewFile) {
            const file = data.imageFile![0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('imageFile', file);
        }
        (data.secServicio ?? []).forEach((sec, idx) => {
            if (sec.imageFile && sec.imageFile.length > 0) {
                const file = sec.imageFile[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('secImages', file);
            } else {
                formData.append('secImages', new File([], `empty-${idx}`));
            }
        });
        const slug = data.nombreServicio
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        const servicioData = {
            nombreServicio: data.nombreServicio,
            descripcion: data.descripcion,
            valor: data.valor,
            nombrePromocion: data.nombrePromocion,
            porcentajeDescuento: data.porcentajeDescuento,
            destacado: data.destacado,
            icono: data.icono,
            orden: data.orden,
            activo: data.activo,
            slug: slug,
            imgUrl: hasNewFile ? null : (data.imgUrl ?? null),
            imgAlt: data.imgAlt || null,
            secServicio: (data.secServicio ?? []).map((sec, index) => {
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
        formData.append('data', JSON.stringify(servicioData));
        return await apiFetchFormData<ServicioEntity>(`servicios/servicio/update/${servicioId}`, formData, 'PUT');
    }

    public static async updateServicioOrden(id: string, orden: number): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>(`servicios/servicio/update/order/${id}`, 'PATCH', { id, orden });
    }

    public static async deleteServicio(servicioId: string): Promise<void> {
        return await apiFetch<void>(`servicios/servicio/delete/${servicioId}`, 'DELETE');
    }

}
