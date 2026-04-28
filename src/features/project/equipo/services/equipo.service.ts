import { apiFetch } from '@/shared/api/client';
import { EquipoEntity } from '@/features/project';
import { EmpleadoEntity } from '../entities/empleado.entity';

export class EquipoService {

    public static async getEquipo(): Promise<EquipoEntity | null> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetch<EquipoEntity>(`equipo/project/ver-todo?proyecto_id=${id_proyecto}`, 'GET');
    }

    public static async getEmpleadoBySlug(slug: string): Promise<EmpleadoEntity | null> {
        const equipo = await this.getEquipo();
        if (!equipo) return null;
        return equipo.empleado.find(emp => emp.slug === slug) ?? null;
    }

}
