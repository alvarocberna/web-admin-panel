//shared
import {apiFetch} from '@/shared/api/client';
//features
import {  ActividadEntity } from '@/features';

export class ActividadService{

    /*No enviamos params, solo el user_id que se encuentra en el access_token de las cookies*/
    public static async getActividadAll(): Promise<ActividadEntity[]>{
        return await apiFetch<ActividadEntity[]>('actividad/all', 'GET')
    }

} 