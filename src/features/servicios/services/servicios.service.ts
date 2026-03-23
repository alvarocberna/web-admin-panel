import { apiFetch } from '@/shared/api/client';
import { ServiciosEntity } from '../entities/servicios.entity';
import { ServicioEntity } from '../entities/servicio.entity';
import { CreateServiciosDto, UpdateServiciosDto } from '../dtos/servicios.dto';
import { CreateServicioDto, UpdateServicioDto } from '../dtos/servicio.dto';

export class ServiciosService {

    public static async createServicios(data: CreateServiciosDto, proyecto_id?: string): Promise<ServiciosEntity> {
        const url = proyecto_id ? `servicios/crear?proyecto_id=${proyecto_id}` : 'servicios/crear';
        return await apiFetch<ServiciosEntity>(url, 'POST', data);
    }

    public static async getServicios(proyecto_id?: string): Promise<ServiciosEntity | null> {
        const url = proyecto_id ? `servicios/ver-todo?proyecto_id=${proyecto_id}` : 'servicios/ver-todo';
        return await apiFetch<ServiciosEntity>(url, 'GET');
    }

    public static async updateServicios(data: UpdateServiciosDto, proyecto_id?: string): Promise<ServiciosEntity> {
        const url = proyecto_id ? `servicios/editar?proyecto_id=${proyecto_id}` : 'servicios/editar';
        return await apiFetch<ServiciosEntity>(url, 'PUT', data);
    }

    public static async createServicio(data: CreateServicioDto): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>('servicios/servicio/crear', 'POST', data);
    }

    public static async getServicio(id_servicio: string): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>(`servicios/servicio/ver/${id_servicio}`, 'GET');
    }

    public static async updateServicio(id_servicio: string, data: UpdateServicioDto): Promise<ServicioEntity> {
        return await apiFetch<ServicioEntity>(`servicios/servicio/editar/${id_servicio}`, 'PUT', data);
    }

    public static async deleteServicio(id_servicio: string): Promise<void> {
        return await apiFetch<void>(`servicios/servicio/eliminar/${id_servicio}`, 'DELETE');
    }

}
