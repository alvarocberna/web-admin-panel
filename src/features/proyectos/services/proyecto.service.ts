import { apiFetch } from '@/shared/api/client';
import { ProyectoEntity } from '../entities/proyecto.entity';

export class ProyectoService {

    public static async getProyecto(proyecto_id: string): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/${proyecto_id}`, 'GET');
    }

}
