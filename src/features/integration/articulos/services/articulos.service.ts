//shared
import {apiFetchCMS} from '@/shared';
//features
import { ArticuloEntityPublic, ArticulosEntityPublic } from '@/features';

export class ArticulosServicePublic{

    /*No enviamos params, solo el user_id que se encuentra en el access_token de las cookies*/
    public static async getArticulos(): Promise<ArticulosEntityPublic>{
        const proyectoId = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetchCMS<ArticulosEntityPublic>(`articulos/project/all?proyectoId=${proyectoId}`, 'GET')
    }

    public static async getArticuloById(articuloId: string): Promise<ArticuloEntityPublic>{
        const proyectoId = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetchCMS<ArticuloEntityPublic>(`articulos/project/view/${articuloId}?proyectoId=${proyectoId}`, 'GET')
    }

    public static async getArticuloBySlug(slug: string): Promise<ArticuloEntityPublic>{
        const articulos = await this.getArticulos();
        const found = articulos.articulo.find(art => art.slug === slug);
        if (!found) throw new Error('Artículo no encontrado');
        return found;
    }

} 