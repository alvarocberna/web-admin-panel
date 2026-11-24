import { apiFetchServer } from '@/shared/api/client-server';
import { ProyectoEntity } from '@/features';

export class ProyectoService {

    public static async getProyectosAll(): Promise<ProyectoEntity[]> {
        return await apiFetchServer<ProyectoEntity[]>(`proyecto/all`, 'GET');
    }

    public static async getProyecto(proyectoId: string): Promise<ProyectoEntity> {
        return await apiFetchServer<ProyectoEntity>(`proyecto/view/${proyectoId}`, 'GET');
    }

}
