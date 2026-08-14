import { apiFetchCMS } from '@/shared';
import { EquipoEntityPublic } from '@/features';
import { EmpleadoEntityPublic } from '../entities/empleado.entity';

export class EquipoServicePublic {

    public static async getEquipo(): Promise<EquipoEntityPublic | null> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetchCMS<EquipoEntityPublic>(`equipo/project/ver-todo?proyecto_id=${id_proyecto}`, 'GET');
    }

    public static async getEmpleadoBySlug(slug: string): Promise<EmpleadoEntityPublic | null> {
        const equipo = await this.getEquipo();
        if (!equipo) return null;
        return equipo.empleado.find(emp => emp.slug === slug) ?? null;
    }

}
