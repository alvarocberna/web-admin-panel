import { apiFetch } from '@/shared/api/client';
import { ProyectoEntity } from '../entities/proyecto.entity';

export class ProyectoService {

    public static async createProyecto(): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/crear`, 'POST');
    }

    public static async getProyectosAll(): Promise<ProyectoEntity[]> {
        return await apiFetch<ProyectoEntity[]>(`proyecto/ver-todo`, 'GET');
    }

    public static async getProyecto(proyecto_id: string): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/ver/${proyecto_id}`, 'GET');
    }

    public static async updateProyecto(proyecto_id: string): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/editar/${proyecto_id}`, 'PATCH');
    }

    public static async deleteProyecto(proyecto_id: string): Promise<void> {
        return await apiFetch<void>(`proyecto/eliminar/${proyecto_id}`, 'DELETE');
    }

}
