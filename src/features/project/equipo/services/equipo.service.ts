import { apiFetch } from '@/shared/api/client';
import { ProyectoEquipoEntity } from '../entities/equipo.entity';

export class ProyectoEquipoService {

    public static async getEquipo(): Promise<ProyectoEquipoEntity | null> {
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ProyectoEquipoEntity>(`equipo/project/ver-todo?usuario_id=${id_usuario}`, 'GET');
    }

}
