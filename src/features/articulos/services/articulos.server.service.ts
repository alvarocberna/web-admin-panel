//shared
import { apiFetchServer } from '@/shared/api/client-server';
//features
import { ArticuloEntity, ArticulosEntity } from '@/features';

export class ArticulosService{


    public static async getArticulos(proyectoId?: string): Promise<ArticulosEntity | null> {
        const url = proyectoId ? `articulos/all?proyectoId=${proyectoId}` : 'articulos/all';
        return await apiFetchServer<ArticulosEntity>(url, 'GET');
    }

    public static async getArticuloById(articuloId: string): Promise<ArticuloEntity>{
        return await apiFetchServer<ArticuloEntity>(`articulos/articulo/view/${articuloId}`, 'GET')
    }
    
} 