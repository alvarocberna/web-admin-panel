//shared
import {apiFetch, apiFetchFormData} from '@/shared/api/client';
//features
import { UpdateArticuloForm, CreateArticuloForm, CreateArticuloDto, UpdateArticuloDto } from '@/features'
import { UsuarioService, ArticuloEntity, ArticulosEntity, CreateArticulosDto, UpdateArticulosDto } from '@/features';

export class ArticulosService{

    public static async createArticulos(data: CreateArticulosDto, proyecto_id?: string): Promise<ArticulosEntity> {
        const url = proyecto_id ? `articulos/crear?proyecto_id=${proyecto_id}` : 'articulos/crear';
        return await apiFetch<ArticulosEntity>(url, 'POST', data);
    }

    public static async getArticulos(proyecto_id?: string): Promise<ArticulosEntity | null> {
        const url = proyecto_id ? `articulos/ver-todo?proyecto_id=${proyecto_id}` : 'articulos/ver-todo';
        return await apiFetch<ArticulosEntity>(url, 'GET');
    }

    public static async updateArticulos(data: UpdateArticulosDto, proyecto_id?: string): Promise<ArticulosEntity> {
        const url = proyecto_id ? `articulos/editar?proyecto_id=${proyecto_id}` : 'articulos/editar';
        return await apiFetch<ArticulosEntity>(url, 'PATCH', data);
    }

    public static async createArticulo(data: CreateArticuloForm): Promise<void>{
        const user = await UsuarioService.getUsuario();
        const formData = new FormData();

        // 1. Agregar imagen principal si existe
        if (data.image_file && data.image_file.length > 0) {
            const file = data.image_file[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo principal debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen principal no puede superar 5MB.');
            formData.append('image_file', file);
        }

        // 2. Agregar imágenes de secciones
        // Mantener el orden/índices: si una sección no tiene imagen, añadir un placeholder vacío
        data.sec_articulo.forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                const file = sec.image_file[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('sec_images', file);
            } else {
                // Agrega un archivo vacío como placeholder para preservar la posición
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });

        // 3. Crear objeto con TODOS los datos del artículo
        const articulos = await ArticulosService.getArticulos();
        const status = articulos?.aprobar ? 'pending' : 'approved';
        const slug = data.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const articuloData: CreateArticuloDto = {
            titulo: data.titulo,
            subtitulo: data.subtitulo,
            autor: user.nombre + ' ' + user.apellido,
            fecha_publicacion: new Date(),
            fecha_actualizacion: new Date(),
            status: status,
            activo: true,
            slug: slug,
            image_url: null,
            image_alt: data.image_alt || '',
            image_position: null,
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
        return await apiFetchFormData<any>('articulos/articulo/crear', formData, 'POST');
    }

    public static async getArticuloById(id_articulo: string): Promise<ArticuloEntity>{
        return await apiFetch<ArticuloEntity>(`articulos/articulo/ver/${id_articulo}`, 'GET')
    }

    public static async updateArticulo(id_articulo: string, data: UpdateArticuloForm): Promise<void>{
        const user = await UsuarioService.getUsuario();
        const formData = new FormData();

        // 1. Agregar imagen principal si existe
        const hasNewMainFile = data.image_file && data.image_file.length > 0;
        if (hasNewMainFile) {
            const file = data.image_file![0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo principal debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen principal no puede superar 5MB.');
            formData.append('image_file', file);
        }

        // 2. Agregar imágenes de secciones
        // Mantener el orden/índices: si una sección no tiene imagen, añadir un placeholder vacío
        data.sec_articulo.forEach((sec, idx) => {
            if (sec.image_file && sec.image_file.length > 0) {
                const file = sec.image_file[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('sec_images', file);
            } else {
                // Agrega un archivo vacío como placeholder para preservar la posición
                formData.append('sec_images', new File([], `empty-${idx}`));
            }
        });

        // 3. Crear objeto con TODOS los datos del artículo
        const articulos = await ArticulosService.getArticulos();
        const status = articulos?.aprobar ? 'pending' : 'approved';
        const slug = data.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const articuloData: UpdateArticuloDto = {
            titulo: data.titulo,
            subtitulo: data.subtitulo || '',
            autor: user.nombre + ' ' + user.apellido,
            fecha_publicacion: new Date(),
            fecha_actualizacion: new Date(),
            status: status,
            activo: data.activo ?? true,
            slug: slug,
            image_url: hasNewMainFile ? null : (data.image_url ?? null),
            image_alt: data.image_alt || '',
            image_position: null,
            sec_articulo: data.sec_articulo.map((dataSec, index) => {
                const hasNewSecFile = dataSec.image_file && dataSec.image_file.length > 0;
                return {
                    id: dataSec.id_sec,
                    nro_seccion: index,
                    titulo_sec: dataSec.titulo_sec,
                    contenido_sec: dataSec.contenido_sec,
                    image_url: hasNewSecFile ? null : (dataSec.image_url ?? null),
                    image_alt: dataSec.image_alt || null,
                    image_position: dataSec.image_position || null,
                };
            })
        };
        
        // 4. ✅ IMPORTANTE: Enviar TODO en un solo campo 'data' como JSON
        formData.append('data', JSON.stringify(articuloData));
        // 5. Realizar la petición
        return await apiFetchFormData<any>(`articulos/articulo/editar/${id_articulo}`, formData, 'PUT');
    }

    //elimina un articulo por id
    public static async deleteArticulo(id_articulo: string): Promise<void>{
        return await apiFetch<any>(`articulos/articulo/eliminar/${id_articulo}`, 'DELETE')
    }

    //modifica el status de un articulo a 'approved'
    public static async approveArticulo(id_articulo: string): Promise<void>{
        return await apiFetch<void>(`articulos/articulo/editar-status/${id_articulo}`, 'PATCH', { status: 'approved' });
    }
} 