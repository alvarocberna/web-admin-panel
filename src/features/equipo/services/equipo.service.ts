import { apiFetch } from '@/shared/api/client';
import { EquipoEntity } from '../entities/equipo.entity';
import { EmpleadoEntity } from '../entities/empleado.entity';
import { CreateEquipoDto, UpdateEquipoDto, CreateEmpleadoDto, UpdateEmpleadoDto } from '../dtos/equipo.dto';

export class EquipoService {

    public static async getEquipo(): Promise<EquipoEntity | null> {
        return await apiFetch<EquipoEntity>('equipo/ver-todo', 'GET');
    }

    public static async createEquipo(data: CreateEquipoDto): Promise<EquipoEntity> {
        return await apiFetch<EquipoEntity>('equipo/crear', 'POST', data);
    }

    public static async updateEquipo(data: UpdateEquipoDto): Promise<EquipoEntity> {
        return await apiFetch<EquipoEntity>('equipo/editar', 'PUT', data);
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
