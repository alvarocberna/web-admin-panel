import { apiFetch, apiFetchFormData } from '@/shared/api/client';
import { ServiciosEntity } from '../entities/servicios.entity';
import { ServicioEntity } from '../entities/servicio.entity';
import { CreateServiciosDto, UpdateServiciosDto } from '../dtos/servicios.dto';

export interface SecServicioFormInput {
    id_sec?: string;
    titulo_sec: string;
    contenido_sec: string;
    image_file?: FileList;
    image_url?: string | null;
    image_alt?: string;
    image_position?: string;
}

export interface ServicioFormInput {
    nombre_servicio: string;
    descripcion: string | null;
    valor: number | null;
    nombre_promocion: string | null;
    porcentaje_descuento: number | null;
    destacado: boolean | null;
    icono: string | null;
    orden: string | null;
    activo: boolean;
    img_url?: string | null;
    img_alt?: string | null;
    image_file?: FileList;
    sec_servicio?: SecServicioFormInput[];
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
        return await apiFetch<ServiciosEntity>(url, 'PATCH', data);
    }

    public static async createServicio(data: ServicioFormInput): Promise<ServicioEntity> {
        const formData = new FormData();
        if (data.image_file && data.image_file.length > 0) {
            const file = data.image_file[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('image_file', file);
        }
        (data.sec_servicio ?? []).forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                const file = sec.image_file[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('sec_images', file);
            } else {
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });
        const slug = data.nombre_servicio
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
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
            slug: slug,
            img_url: null,
            img_alt: data.img_alt || null,
            sec_servicio: (data.sec_servicio ?? []).map((sec, index) => ({
                nro_seccion: index,
                titulo_sec: sec.titulo_sec,
                contenido_sec: sec.contenido_sec,
                image_url: null,
                image_alt: sec.image_alt || null,
                image_position: sec.image_position || null,
            })),
        };
        formData.append('data', JSON.stringify(servicioData));
        return await apiFetchFormData<ServicioEntity>('servicios/servicio/crear', formData, 'POST');
    }

    public static async getServicio(id_servicio: string): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>(`servicios/servicio/ver/${id_servicio}`, 'GET');
    }

    public static async updateServicio(id_servicio: string, data: ServicioFormInput): Promise<ServicioEntity> {
        const formData = new FormData();
        const hasNewFile = data.image_file && data.image_file.length > 0;
        if (hasNewFile) {
            const file = data.image_file![0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no puede superar 5MB.');
            formData.append('image_file', file);
        }
        (data.sec_servicio ?? []).forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                const file = sec.image_file[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('sec_images', file);
            } else {
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });
        const slug = data.nombre_servicio
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
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
            slug: slug,
            img_url: hasNewFile ? null : (data.img_url ?? null),
            img_alt: data.img_alt || null,
            sec_servicio: (data.sec_servicio ?? []).map((sec, index) => {
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
        formData.append('data', JSON.stringify(servicioData));
        return await apiFetchFormData<ServicioEntity>(`servicios/servicio/editar/${id_servicio}`, formData, 'PUT');
    }

    public static async updateServicioOrden(id: string, orden: number): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>(`servicios/servicio/editar/orden/${id}`, 'PATCH', { id, orden });
    }

    public static async deleteServicio(id_servicio: string): Promise<void> {
        return await apiFetch<void>(`servicios/servicio/eliminar/${id_servicio}`, 'DELETE');
    }

}
