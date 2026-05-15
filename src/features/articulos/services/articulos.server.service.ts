//shared
import { apiFetchServer } from '@/shared/api/client-server';
//features
import { ArticuloEntity, ArticulosEntity } from '@/features';

export class ArticulosService{


    public static async getArticulos(proyecto_id?: string): Promise<ArticulosEntity | null> {
        const url = proyecto_id ? `articulos/ver-todo?proyecto_id=${proyecto_id}` : 'articulos/ver-todo';
        return await apiFetchServer<ArticulosEntity>(url, 'GET');
    }

    public static async getArticuloById(id_articulo: string): Promise<ArticuloEntity>{
        return await apiFetchServer<ArticuloEntity>(`articulos/articulo/ver/${id_articulo}`, 'GET')
    }
    
} 