//shared
import {apiFetch} from '@/shared/api/client';
//features
import { ArticuloEntity, ArticulosEntity } from '@/features/project';

export class ArticulosService{

    /*No enviamos params, solo el user_id que se encuentra en el access_token de las cookies*/
    public static async getArticulos(): Promise<ArticulosEntity>{
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ArticulosEntity>(`articulos/project/ver-todo?usuario_id=${id_usuario}`, 'GET')
    }

    public static async getArticuloById(id_articulo: string): Promise<ArticuloEntity>{
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<ArticuloEntity>(`articulos/project/ver/${id_articulo}?usuario_id=${id_usuario}`, 'GET')
    }

    public static async getArticuloBySlug(slug: string): Promise<ArticuloEntity>{
        const articulos = await this.getArticulos();
        const found = articulos.articulo.find(art => art.slug === slug);
        if (!found) throw new Error('Artículo no encontrado');
        return found;
    }

} 