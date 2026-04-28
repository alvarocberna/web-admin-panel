import { apiFetch } from '@/shared/api/client';
import { ServiciosEntity } from '../entities/servicios.entity';
import { ServicioEntity } from '../entities/servicio.entity';

export class ServiciosService {

    public static async getServicios(): Promise<ServiciosEntity | null> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetch<ServiciosEntity>(`servicios/project/ver-todo?proyecto_id=${id_proyecto}`, 'GET');
    }

    public static async getServicioBySlug(slug: string): Promise<ServicioEntity | null> {
        const servicios = await this.getServicios();
        if (!servicios) return null;
        return servicios.servicio.find(srv => srv.slug === slug) ?? null;
    }

}
