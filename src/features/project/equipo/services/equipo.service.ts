import { apiFetch } from '@/shared/api/client';
import { EquipoEntity } from '@/features/project';
import { EmpleadoEntity } from '../entities/empleado.entity';

export class EquipoService {

    public static async getEquipo(): Promise<EquipoEntity | null> {
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<EquipoEntity>(`equipo/project/ver-todo?usuario_id=${id_usuario}`, 'GET');
    }

    public static async getEmpleadoBySlug(slug: string): Promise<EmpleadoEntity | null> {
        const equipo = await this.getEquipo();
        if (!equipo) return null;
        return equipo.empleado.find(emp => emp.slug === slug) ?? null;
    }

}
