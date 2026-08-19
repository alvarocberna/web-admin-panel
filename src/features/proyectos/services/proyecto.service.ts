import { apiFetch } from '@/shared/api/client';
import { ProyectoEntity } from '../entities/proyecto.entity';
import { CreateProyectoDto, UpdateProyectoDto } from '../dtos/proyecto.dto';

export class ProyectoService {

    public static async createProyecto(data: CreateProyectoDto): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/create`, 'POST', data);
    }

    public static async getProyectosAll(): Promise<ProyectoEntity[]> {
        return await apiFetch<ProyectoEntity[]>(`proyecto/all`, 'GET');
    }

    public static async getProyecto(proyectoId: string): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/view/${proyectoId}`, 'GET');
    }

    public static async updateProyecto(proyectoId: string, data: UpdateProyectoDto): Promise<ProyectoEntity> {
        return await apiFetch<ProyectoEntity>(`proyecto/update/${proyectoId}`, 'PATCH', data);
    }

    public static async deleteProyecto(proyectoId: string): Promise<void> {
        return await apiFetch<void>(`proyecto/delete/${proyectoId}`, 'DELETE');
    }

}
