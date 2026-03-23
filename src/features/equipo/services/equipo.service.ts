import { apiFetch } from '@/shared/api/client';
import { EquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { CreateEquipoDto, UpdateEquipoDto, CreateEmpleadoDto, UpdateEmpleadoDto } from '../dtos/equipo.dto';

export class EquipoService {

    public static async getEquipo(proyecto_id?: string): Promise<EquipoEntity | null> {
        const url = proyecto_id ? `equipo/ver-todo?proyecto_id=${proyecto_id}` : 'equipo/ver-todo';
        return await apiFetch<EquipoEntity>(url, 'GET');
    }

    public static async createEquipo(data: CreateEquipoDto, proyecto_id?: string): Promise<EquipoEntity> {
        const url = proyecto_id ? `equipo/crear?proyecto_id=${proyecto_id}` : 'equipo/crear';
        return await apiFetch<EquipoEntity>(url, 'POST', data);
    }

    public static async updateEquipo(data: UpdateEquipoDto, proyecto_id?: string): Promise<EquipoEntity> {
        const url = proyecto_id ? `equipo/editar?proyecto_id=${proyecto_id}` : 'equipo/editar';
        return await apiFetch<EquipoEntity>(url, 'PUT', data);
    }

    public static async createEmpleado(data: CreateEmpleadoDto): Promise<EmpleadoEntity> {
        return await apiFetch<EmpleadoEntity>('equipo/empleado/crear', 'POST', data);
    }

    public static async getEmpleado(id_empleado: string): Promise<EmpleadoEntity> {
        return await apiFetch<EmpleadoEntity>(`equipo/empleado/ver/${id_empleado}`, 'GET');
    }

    public static async updateEmpleado(id_empleado: string, data: UpdateEmpleadoDto): Promise<EmpleadoEntity> {
        return await apiFetch<EmpleadoEntity>(`equipo/empleado/editar/${id_empleado}`, 'PUT', data);
    }

    public static async deleteEmpleado(id_empleado: string): Promise<void> {
        return await apiFetch<void>(`equipo/empleado/eliminar/${id_empleado}`, 'DELETE');
    }

}
