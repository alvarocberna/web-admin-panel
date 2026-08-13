//shared
import {apiFetch} from '@/shared/api/client';
//features
import { ArticuloEntityPublic, ArticulosEntityPublic } from '@/features';

export class ArticulosServicePublic{

    /*No enviamos params, solo el user_id que se encuentra en el access_token de las cookies*/
    public static async getArticulos(): Promise<ArticulosEntityPublic>{
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetch<ArticulosEntityPublic>(`articulos/project/ver-todo?proyecto_id=${id_proyecto}`, 'GET')
    }

    public static async getArticuloById(id_articulo: string): Promise<ArticuloEntityPublic>{
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetch<ArticuloEntityPublic>(`articulos/project/ver/${id_articulo}?proyecto_id=${id_proyecto}`, 'GET')
    }

    public static async getArticuloBySlug(slug: string): Promise<ArticuloEntityPublic>{
        const articulos = await this.getArticulos();
        const found = articulos.articulo.find(art => art.slug === slug);
        if (!found) throw new Error('Artículo no encontrado');
        return found;
    }

} 