//shared
import {apiFetch, apiFetchFormData} from '@/shared/api/client';
//features
import { UpdateArticuloForm, CreateArticuloForm } from '@/features'
import { UsuarioService, ArticuloEntity } from '@/features';

export class ArticulosService{

    /*No enviamos params, solo el user_id que se encuentra en el access_token de las cookies*/
    public static async getArticulos(): Promise<ArticuloEntity[]>{
        return await apiFetch<ArticuloEntity[]>('articulo/ver-todos', 'GET')
    }

    public static async getArticuloById(id_articulo: string): Promise<ArticuloEntity>{
        return await apiFetch<ArticuloEntity>(`articulo/ver/${id_articulo}`, 'GET')
    }

    public static async createArticulo(data: CreateArticuloForm): Promise<void>{
        const user = await UsuarioService.getUsuario();
        const formData = new FormData();
        
        // 1. Agregar imagen principal si existe
        if (data.image_file && data.image_file.length > 0) {
            formData.append('image_file', data.image_file[0]);
        }
        
        // 2. Agregar imágenes de secciones
        // Mantener el orden/índices: si una sección no tiene imagen, añadir un placeholder vacío
        data.sec_articulo.forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                formData.append('sec_images', sec.image_file[0]);
            } else {
                // Agrega un archivo vacío como placeholder para preservar la posición
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });
        
        // 3. Crear objeto con TODOS los datos del artículo
        const articuloData = {
            titulo: data.titulo,
            subtitulo: data.subtitulo,
            autor: user.nombre + ' ' + user.apellido,
            fecha_publicacion: new Date(),
            fecha_actualizacion: new Date(),
            status: 'test',
            slug: 'test',
            image_url: null,
            image_alt: data.image_alt || '',
            image_position: null,
            autor_id: user.id,
            sec_articulo: data.sec_articulo.map((dataSec, index) => ({
                nro_seccion: index,
                titulo_sec: dataSec.titulo_sec,
                contenido_sec: dataSec.contenido_sec,
                image_url: null,
                image_alt: dataSec.image_alt || null,
                image_position: dataSec.image_position || null,
            }))
        };
        // 4. ✅ IMPORTANTE: Enviar TODO en un solo campo 'data' como JSON
        formData.append('data', JSON.stringify(articuloData));

        // 5. Realizar la petición
        return await apiFetchFormData<any>('articulo/crear', formData, 'POST');
}

    public static async updateArticulo(id_articulo: string, data: UpdateArticuloForm): Promise<void>{
        const user = await UsuarioService.getUsuario();
        const formData = new FormData();
        
        // 1. Agregar imagen principal si existe
        if (data.image_file && data.image_file.length > 0) {
            formData.append('image_file', data.image_file[0]);
        }
        
        // 2. Agregar imágenes de secciones
        // Mantener el orden/índices: si una sección no tiene imagen, añadir un placeholder vacío
        data.sec_articulo.forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                formData.append('sec_images', sec.image_file[0]);
            } else {
                // Agrega un archivo vacío como placeholder para preservar la posición
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });
        
        // 3. Crear objeto con TODOS los datos del artículo
        const articuloData = {
            titulo: data.titulo,
            subtitulo: data.subtitulo || '',
            autor: user.nombre + ' ' + user.apellido,
            fecha_publicacion: new Date(),
            fecha_actualizacion: new Date(),
            status: 'test',
            slug: 'test',
            image_url: null,
            image_alt: data.image_alt || '',
            image_position: null,
            autor_id: user.id,
            sec_articulo: data.sec_articulo.map((dataSec, index) => ({
                id: dataSec.id_sec,
                nro_seccion: index,
                titulo_sec: dataSec.titulo_sec,
                contenido_sec: dataSec.contenido_sec,
                image_url: null,
                image_alt: dataSec.image_alt || null,
                image_position: dataSec.image_position || null,
            }))
        };
        
        // 4. ✅ IMPORTANTE: Enviar TODO en un solo campo 'data' como JSON
        formData.append('data', JSON.stringify(articuloData));
        // 5. Realizar la petición
        return await apiFetchFormData<any>(`articulo/editar/${id_articulo}`, formData, 'PUT');
    }

    //elimina un articulo por id
    public static async deleteArticulo(id_articulo: string): Promise<void>{
        return await apiFetch<any>(`articulo/delete/${id_articulo}`, 'DELETE')
    }
} 