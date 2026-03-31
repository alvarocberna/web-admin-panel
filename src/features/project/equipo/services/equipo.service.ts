import { apiFetch } from '@/shared/api/client';
import { ProyectoEquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';

export class ProyectoEquipoService {

    public static async getEquipo(): Promise<ProyectoEquipoEntity | null> {
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ProyectoEquipoEntity>(`equipo/project/ver-todo?usuario_id=${id_usuario}`, 'GET');
    }

    public static async getEmpleadoBySlug(slug: string): Promise<EmpleadoEntity | null> {
        const equipo = await this.getEquipo();
        if (!equipo) return null;
        return equipo.empleado.find(emp => emp.slug === slug) ?? null;
    }

}
