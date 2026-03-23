import { apiFetch } from '@/shared/api/client';
import { ProyectoEntity } from '../entities/proyecto.entity';
import { CreateProyectoDto, UpdateProyectoDto } from '../dtos/proyecto.dto';

export class ProyectoService {

    public static async createProyecto(data: CreateProyectoDto): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/crear`, 'POST', data);
    }

    public static async getProyectosAll(): Promise<ProyectoEntity[]> {
        return await apiFetch<ProyectoEntity[]>(`proyecto/ver-todo`, 'GET');
    }

    public static async getProyecto(proyecto_id: string): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/ver/${proyecto_id}`, 'GET');
    }

    public static async updateProyecto(proyecto_id: string, data: UpdateProyectoDto): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/editar/${proyecto_id}`, 'PATCH', data);
    }

    public static async deleteProyecto(proyecto_id: string): Promise<void> {
        return await apiFetch<void>(`proyecto/eliminar/${proyecto_id}`, 'DELETE');
    }

}
