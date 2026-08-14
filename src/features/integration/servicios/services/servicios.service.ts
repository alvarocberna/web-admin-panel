import { apiFetchCMS } from '@/shared';
import { ServiciosEntityPublic } from '../entities/servicios.entity';
import { ServicioEntityPublic } from '../entities/servicio.entity';

export class ServiciosServicePublic {

    public static async getServicios(): Promise<ServiciosEntityPublic | null> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetchCMS<ServiciosEntityPublic>(`servicios/project/ver-todo?proyecto_id=${id_proyecto}`, 'GET');
    }

    public static async getServicioBySlug(slug: string): Promise<ServicioEntityPublic | null> {
        const servicios = await this.getServicios();
        if (!servicios) return null;
        return servicios.servicio.find(srv => srv.slug === slug) ?? null;
    }

}
