import { apiFetchServer } from '@/shared/api/client-server';
import { ServiciosEntity } from '../entities/servicios.entity';
import { ServicioEntity } from '../entities/servicio.entity';

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

    public static async getServicios(proyecto_id?: string): Promise<ServiciosEntity | null> {
        const url = proyecto_id ? `servicios/ver-todo?proyecto_id=${proyecto_id}` : 'servicios/ver-todo';
        return await apiFetchServer<ServiciosEntity>(url, 'GET');
    }

    public static async getServicio(id_servicio: string): Promise<ServicioEntity> {
        return await apiFetchServer<ServicioEntity>(`servicios/servicio/ver/${id_servicio}`, 'GET');
    }

}
