import { apiFetchServer } from '@/shared/api/client-server';
import { ProyectoEntity } from '@/features';

export class ProyectoService {

    public static async getProyectosAll(): Promise<ProyectoEntity[]> {
        return await apiFetchServer<ProyectoEntity[]>(`proyecto/ver-todo`, 'GET');
    }

    public static async getProyecto(proyecto_id: string): Promise<ProyectoEntity> {
        return await apiFetchServer<ProyectoEntity>(`proyecto/ver/${proyecto_id}`, 'GET');
    }

}
