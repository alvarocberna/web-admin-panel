import { apiFetch } from '@/shared/api/client';
import { ProyectoServiciosEntity } from '../entities/servicios.entity';

export class ProyectoServiciosService {

    public static async getServicios(): Promise<ProyectoServiciosEntity | null> {
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ProyectoServiciosEntity>(`servicios/project/ver-todo?usuario_id=${id_usuario}`, 'GET');
    }

}
