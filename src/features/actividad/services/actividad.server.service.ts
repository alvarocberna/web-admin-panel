import { apiFetchServer } from '@/shared/api/client-server';
import { ActividadEntity } from '../entities/actividad.entity';

export class ActividadService {
    public static async getActividadAll(): Promise<ActividadEntity[]> {
        return await apiFetchServer<ActividadEntity[]>('actividad/all', 'GET');
    }
}
