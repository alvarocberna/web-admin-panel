import { apiFetchServer } from '@/shared/api/client-server';
import { ServiciosEntity } from '../entities/servicios.entity';
import { ServicioEntity } from '../entities/servicio.entity';

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

    public static async getServicios(proyectoId?: string): Promise<ServiciosEntity | null> {
        const url = proyectoId ? `servicios/all?proyectoId=${proyectoId}` : 'servicios/all';
        return await apiFetchServer<ServiciosEntity>(url, 'GET');
    }

    public static async getServicio(servicioId: string): Promise<ServicioEntity> {
        return await apiFetchServer<ServicioEntity>(`servicios/servicio/view/${servicioId}`, 'GET');
    }

}
