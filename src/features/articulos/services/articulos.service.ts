//shared
import {apiFetch, apiFetchFormData} from '@/shared/api/client';
//features
import { UpdateArticuloForm, CreateArticuloForm, CreateArticuloDto, UpdateArticuloDto } from '@/features'
import { UsuarioService, ArticuloEntity, ArticulosEntity, CreateArticulosDto, UpdateArticulosDto } from '@/features';

export class ArticulosService{

    public static async createArticulos(data: CreateArticulosDto, proyectoId?: string): Promise<ArticulosEntity> {
        const url = proyectoId ? `articulos/create?proyectoId=${proyectoId}` : 'articulos/create';
        return await apiFetch<ArticulosEntity>(url, 'POST', data);
    }

    public static async getArticulos(proyectoId?: string): Promise<ArticulosEntity | null> {
        const url = proyectoId ? `articulos/all?proyectoId=${proyectoId}` : 'articulos/all';
        return await apiFetch<ArticulosEntity>(url, 'GET');
    }

    public static async updateArticulos(data: UpdateArticulosDto, proyectoId?: string): Promise<ArticulosEntity> {
        const url = proyectoId ? `articulos/update?proyectoId=${proyectoId}` : 'articulos/update';
        return await apiFetch<ArticulosEntity>(url, 'PATCH', data);
    }

    public static async createArticulo(data: CreateArticuloForm): Promise<void>{
        const user = await UsuarioService.getUsuario();
        const formData = new FormData();

        // 1. Agregar imagen principal si existe
        if (data.imageFile && data.imageFile.length > 0) {
            const file = data.imageFile[0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo principal debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen principal no puede superar 5MB.');
            formData.append('imageFile', file);
        }

        // 2. Agregar imágenes de secciones
        // Mantener el orden/índices: si una sección no tiene imagen, añadir un placeholder vacío
        data.secArticulo.forEach((sec, idx) => {
            if (sec.imageFile && sec.imageFile.length > 0) {
                const file = sec.imageFile[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('secImages', file);
            } else {
                // Agrega un archivo vacío como placeholder para preservar la posición
                formData.append('secImages', new File([], `empty-${idx}`));
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
            fechaPublicacion: new Date(),
            fechaActualizacion: new Date(),
            status: status,
            activo: true,
            slug: slug,
            imageUrl: null,
            imageAlt: data.imageAlt || '',
            imagePosition: null,
            secArticulo: data.secArticulo.map((dataSec, index) => ({
                nroSeccion: index,
                tituloSec: dataSec.tituloSec,
                contenidoSec: dataSec.contenidoSec,
                imageUrl: null,
                imageAlt: dataSec.imageAlt || null,
                imagePosition: dataSec.imagePosition || null,
            }))
        };
        // 4. ✅ IMPORTANTE: Enviar TODO en un solo campo 'data' como JSON
        formData.append('data', JSON.stringify(articuloData));

        // 5. Realizar la petición
        return await apiFetchFormData<any>('articulos/articulo/create', formData, 'POST');
    }

    public static async getArticuloById(articuloId: string): Promise<ArticuloEntity>{
        return await apiFetch<ArticuloEntity>(`articulos/articulo/view/${articuloId}`, 'GET')
    }

    public static async updateArticulo(articuloId: string, data: UpdateArticuloForm): Promise<void>{
        const user = await UsuarioService.getUsuario();
        const formData = new FormData();

        // 1. Agregar imagen principal si existe
        const hasNewMainFile = data.imageFile && data.imageFile.length > 0;
        if (hasNewMainFile) {
            const file = data.imageFile![0];
            if (!file.type.startsWith('image/')) throw new Error('El archivo principal debe ser una imagen.');
            if (file.size > 5 * 1024 * 1024) throw new Error('La imagen principal no puede superar 5MB.');
            formData.append('imageFile', file);
        }

        // 2. Agregar imágenes de secciones
        // Mantener el orden/índices: si una sección no tiene imagen, añadir un placeholder vacío
        data.secArticulo.forEach((sec, idx) => {
            if (sec.imageFile && sec.imageFile.length > 0) {
                const file = sec.imageFile[0];
                if (!file.type.startsWith('image/')) throw new Error(`La imagen de la sección ${idx + 1} debe ser una imagen.`);
                if (file.size > 5 * 1024 * 1024) throw new Error(`La imagen de la sección ${idx + 1} no puede superar 5MB.`);
                formData.append('secImages', file);
            } else {
                // Agrega un archivo vacío como placeholder para preservar la posición
                formData.append('secImages', new File([], `empty-${idx}`));
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
            fechaPublicacion: new Date(),
            fechaActualizacion: new Date(),
            status: status,
            activo: data.activo ?? true,
            slug: slug,
            imageUrl: hasNewMainFile ? null : (data.imageUrl ?? null),
            imageAlt: data.imageAlt || '',
            imagePosition: null,
            secArticulo: data.secArticulo.map((dataSec, index) => {
                const hasNewSecFile = dataSec.imageFile && dataSec.imageFile.length > 0;
                return {
                    id: dataSec.idSec,
                    nroSeccion: index,
                    tituloSec: dataSec.tituloSec,
                    contenidoSec: dataSec.contenidoSec,
                    imageUrl: hasNewSecFile ? null : (dataSec.imageUrl ?? null),
                    imageAlt: dataSec.imageAlt || null,
                    imagePosition: dataSec.imagePosition || null,
                };
            })
        };
        
        // 4. ✅ IMPORTANTE: Enviar TODO en un solo campo 'data' como JSON
        formData.append('data', JSON.stringify(articuloData));
        // 5. Realizar la petición
        return await apiFetchFormData<any>(`articulos/articulo/update/${articuloId}`, formData, 'PUT');
    }

    //elimina un articulo por id
    public static async deleteArticulo(articuloId: string): Promise<void>{
        return await apiFetch<any>(`articulos/articulo/delete/${articuloId}`, 'DELETE')
    }

    //modifica el status de un articulo a 'approved'
    public static async approveArticulo(articuloId: string): Promise<void>{
        return await apiFetch<void>(`articulos/articulo/update-status/${articuloId}`, 'PATCH', { status: 'approved' });
    }
} 