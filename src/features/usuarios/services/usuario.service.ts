
//shared
import {apiFetch} from '@/shared';
//features
import { UsuarioEntity } from '../entities/usuario.entity';
import { UpdateUsuarioInfoDto, UpdateUsuarioPasswordDto, CreateUsuarioDto, UpdateUsuarioDto } from '../dtos/usuario.dto';

export class UsuarioService{

    /*no enviamos datos, ya que solo enviamos el id del usuario autenticado
      que se encuentra en el access_token de las cookies*/
    public static async getUsuario(): Promise<UsuarioEntity>{
        return await apiFetch<any>('usuario/user/authenticated', 'GET')
    }

    public static async updateUsuarioInfo(data: UpdateUsuarioDto): Promise<UsuarioEntity>{
        return await apiFetch<UsuarioEntity>('usuario/user/editar', 'PATCH', data)
    }

    public static async updateUsuarioPassword(data: UpdateUsuarioPasswordDto): Promise<void>{
        return await apiFetch<void>('usuario/user/password', 'PATCH', data)
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    public static async createUsuarioAdmin(data: CreateUsuarioDto, proyecto_id: string): Promise<UsuarioEntity> {
        return await apiFetch<UsuarioEntity>(`usuario/admin/crear?proyecto_id=${proyecto_id}`, 'POST', data);
    }

    public static async getUsuariosAdmin(proyecto_id: string): Promise<UsuarioEntity[]> {
        return await apiFetch<UsuarioEntity[]>(`usuario/admin/ver-todo?proyecto_id=${proyecto_id}`, 'GET');
    }

    public static async getUsuarioAdmin(usuario_id: string): Promise<UsuarioEntity> {
        return await apiFetch<UsuarioEntity>(`usuario/admin/ver/${usuario_id}`, 'GET');
    }

    public static async updateUsuarioAdmin(usuario_id: string, data: UpdateUsuarioDto): Promise<UsuarioEntity> {
        return await apiFetch<UsuarioEntity>(`usuario/admin/editar/${usuario_id}`, 'PATCH', data);
    }

    public static async deleteUsuarioAdmin(usuario_id: string, proyecto_id: string): Promise<void> {
        return await apiFetch<void>(`usuario/admin/eliminar/${usuario_id}?proyecto_id=${proyecto_id}`, 'DELETE');
    }

}