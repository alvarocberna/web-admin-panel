//shared
import {apiFetch} from '@/shared/api/client';
//features
import { ArticuloEntity } from '@/features/project';

export class ArticulosService{

    /*No enviamos params, solo el user_id que se encuentra en el access_token de las cookies*/
    public static async getArticulos(): Promise<ArticuloEntity[]>{
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ArticuloEntity[]>(`articulo/project/ver-todos?id_usuario=${id_usuario}`, 'GET')
    }

    public static async getArticuloById(id_articulo: string): Promise<ArticuloEntity>{
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ArticuloEntity>(`articulo/project/ver/${id_articulo}?id_usuario=${id_usuario}`, 'GET')
    }

} 