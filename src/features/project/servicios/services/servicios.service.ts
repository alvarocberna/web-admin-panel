import { apiFetch } from '@/shared/api/client';
import { ServiciosEntity } from '../entities/servicios.entity';

export class ServiciosService {

    public static async getServicios(): Promise<ServiciosEntity | null> {
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ServiciosEntity>(`servicios/project/ver-todo?usuario_id=${id_usuario}`, 'GET');
    }

}
