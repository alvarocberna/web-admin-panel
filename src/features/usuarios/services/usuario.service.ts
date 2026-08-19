
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
        return await apiFetch<UsuarioEntity>('usuario/user/update', 'PATCH', data)
    }

    public static async updateUsuarioPassword(data: UpdateUsuarioPasswordDto): Promise<void>{
        return await apiFetch<void>('usuario/user/password', 'PATCH', data)
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    public static async createUsuarioAdmin(data: CreateUsuarioDto, proyectoId: string): Promise<UsuarioEntity> {
        return await apiFetch<UsuarioEntity>(`usuario/admin/create?proyectoId=${proyectoId}`, 'POST', data);
    }

    public static async getUsuariosAdmin(proyectoId: string): Promise<UsuarioEntity[]> {
        return await apiFetch<UsuarioEntity[]>(`usuario/admin/all?proyectoId=${proyectoId}`, 'GET');
    }

    public static async getUsuarioAdmin(usuarioId: string): Promise<UsuarioEntity> {
        return await apiFetch<UsuarioEntity>(`usuario/admin/view/${usuarioId}`, 'GET');
    }

    public static async updateUsuarioAdmin(usuarioId: string, data: UpdateUsuarioDto): Promise<UsuarioEntity> {
        return await apiFetch<UsuarioEntity>(`usuario/admin/update/${usuarioId}`, 'PATCH', data);
    }

    public static async deleteUsuarioAdmin(usuarioId: string, proyectoId: string): Promise<void> {
        return await apiFetch<void>(`usuario/admin/delete/${usuarioId}?proyectoId=${proyectoId}`, 'DELETE');
    }

}