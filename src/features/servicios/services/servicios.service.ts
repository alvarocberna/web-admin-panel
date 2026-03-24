import { apiFetch, apiFetchFormData } from '@/shared/api/client';
import { ServiciosEntity } from '../entities/servicios.entity';
import { ServicioEntity } from '../entities/servicio.entity';
import { CreateServiciosDto, UpdateServiciosDto } from '../dtos/servicios.dto';

export interface ServicioFormInput {
    nombre_servicio: string;
    descripcion: string | null;
    valor: string | null;
    nombre_promocion: string | null;
    porcentaje_descuento: string | null;
    destacado: boolean | null;
    icono: string | null;
    orden: string | null;
    activo: boolean;
    img_alt?: string | null;
    image_file?: FileList;
}

export class ServiciosService {

    public static async createServicios(data: CreateServiciosDto, proyecto_id?: string): Promise<ServiciosEntity> {
        const url = proyecto_id ? `servicios/crear?proyecto_id=${proyecto_id}` : 'servicios/crear';
        return await apiFetch<ServiciosEntity>(url, 'POST', data);
    }

    public static async getServicios(proyecto_id?: string): Promise<ServiciosEntity | null> {
        const url = proyecto_id ? `servicios/ver-todo?proyecto_id=${proyecto_id}` : 'servicios/ver-todo';
        return await apiFetch<ServiciosEntity>(url, 'GET');
    }

    public static async updateServicios(data: UpdateServiciosDto, proyecto_id?: string): Promise<ServiciosEntity> {
        const url = proyecto_id ? `servicios/editar?proyecto_id=${proyecto_id}` : 'servicios/editar';
        return await apiFetch<ServiciosEntity>(url, 'PUT', data);
    }

    public static async createServicio(data: ServicioFormInput): Promise<ServicioEntity> {
        const formData = new FormData();
        if (data.image_file && data.image_file.length > 0) {
            const file = data.image_file[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('image_file', file);
        }
        const servicioData = {
            nombre_servicio: data.nombre_servicio,
            descripcion: data.descripcion,
            valor: data.valor,
            nombre_promocion: data.nombre_promocion,
            porcentaje_descuento: data.porcentaje_descuento,
            destacado: data.destacado,
            icono: data.icono,
            orden: data.orden,
            activo: data.activo,
            img_url: null,
            img_alt: data.img_alt || null,
        };
        formData.append('data', JSON.stringify(servicioData));
        return await apiFetchFormData<ServicioEntity>('servicios/servicio/crear', formData, 'POST');
    }

    public static async getServicio(id_servicio: string): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>(`servicios/servicio/ver/${id_servicio}`, 'GET');
    }

    public static async updateServicio(id_servicio: string, data: ServicioFormInput): Promise<ServicioEntity> {
        const formData = new FormData();
        if (data.image_file && data.image_file.length > 0) {
            const file = data.image_file[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('image_file', file);
        }
        const servicioData = {
            nombre_servicio: data.nombre_servicio,
            descripcion: data.descripcion,
            valor: data.valor,
            nombre_promocion: data.nombre_promocion,
            porcentaje_descuento: data.porcentaje_descuento,
            destacado: data.destacado,
            icono: data.icono,
            orden: data.orden,
            activo: data.activo,
            img_url: null,
            img_alt: data.img_alt || null,
        };
        formData.append('data', JSON.stringify(servicioData));
        return await apiFetchFormData<ServicioEntity>(`servicios/servicio/editar/${id_servicio}`, formData, 'PUT');
    }

    public static async deleteServicio(id_servicio: string): Promise<void> {
        return await apiFetch<void>(`servicios/servicio/eliminar/${id_servicio}`, 'DELETE');
    }

}
