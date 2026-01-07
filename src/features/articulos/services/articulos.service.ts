//shared
import {apiFetch} from '@/shared/api/client';
//features
import {CreateArticuloFullDto, CreateArticuloDto, CreateSecArticuloDto, UpdateSecArticuloDto, UpdateArticuloDto } from '@/features'
import { UpdateArticuloForm, CreateArticuloForm } from '@/features'
import { UsuarioService, ArticuloEntity, NuevoArticuloInterface } from '@/features';

export class ArticulosService{

    /*No enviamos params, solo el user_id que se encuentra en el access_token de las cookies*/
    public static async getArticulos(): Promise<ArticuloEntity[]>{
        return await apiFetch<ArticuloEntity[]>('articulo/ver-todos', 'GET')
    }

    public static async getArticuloById(id_articulo: string): Promise<ArticuloEntity>{
        return await apiFetch<ArticuloEntity>(`articulo/ver/${id_articulo}`, 'GET')
    }

    public static async createArticulo(data: CreateArticuloForm): Promise<void>{
        //traemos al user
        const user =  await UsuarioService.getUsuario();
        //construimos el sec_articulo
        const sec_articulo: CreateSecArticuloDto[] = data.sec_articulo.map((dataSec ,index) => {
            return {
                "nro_seccion": index,
                "titulo_sec": dataSec.titulo_sec,
                "contenido_sec": dataSec.contenido_sec,
                "image_url": "/",
                "image_alt": "test",
                "image_position": "test",
            }
        })
        //construimos el articulo completo
        const dataArticulo: CreateArticuloDto = {
                "titulo": data.titulo,
                "subtitulo": data.subtitulo,
                "autor": user.nombre + ' ' + user.apellido,
                "fecha_publicacion": new Date(),
                "fecha_actualizacion": new Date(),
                "status": "test",
                "slug": "test",
                "image_url": "/",
                "image_alt": "test",
                "image_position": "test",
                "autor_id": user.id,
                "sec_articulo": sec_articulo
        }
        //realizamos la peticion
        return await apiFetch<any>('articulo/crear', 'POST', dataArticulo)
    }

    public static async updateArticulo(id_articulo: string, data: UpdateArticuloForm): Promise<void>{
        //traemos al user
        const user =  await UsuarioService.getUsuario();
        //construimos el sec_articulo
        const sec_articulo: UpdateSecArticuloDto[] = data.sec_articulo.map((dataSec ,index) => {
            return {
                "nro_seccion": index,
                "titulo_sec": dataSec.titulo_sec,
                "contenido_sec": dataSec.contenido_sec,
                "image_url": "/",
                "image_alt": "test",
                "image_position": "test",
            }
        })
        //construimos el articulo completo
        const dataArticulo: UpdateArticuloDto = {
            "titulo": data.titulo,
            "subtitulo": data.subtitulo,
            "autor": user.nombre + ' ' + user.apellido,
            "fecha_publicacion": new Date(),
            "fecha_actualizacion": new Date(),
            "status": "test",
            "slug": "test",
            "image_url": "/",
            "image_alt": "test",
            "image_position": "test",
            "autor_id": user.id,
            "sec_articulo": sec_articulo
        }
        //realizamos la peticion
        return await apiFetch<any>(`articulo/editar/${id_articulo}`, 'PUT', dataArticulo)
    }

    //elimina un articulo por id
    public static async deleteArticulo(id_articulo: string): Promise<void>{
        return await apiFetch<any>(`articulo/delete/${id_articulo}`, 'DELETE')
    }
} 