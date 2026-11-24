
//shared
import {apiFetchServer} from '@/shared/api/client-server';
//features
import { UsuarioEntity } from '../entities/usuario.entity';

export class UsuarioService{

    public static async getUsuario(): Promise<UsuarioEntity>{
        return await apiFetchServer<any>('usuario/user/authenticated', 'GET')
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    public static async getUsuariosAdmin(proyectoId: string): Promise<UsuarioEntity[]> {
        return await apiFetchServer<UsuarioEntity[]>(`usuario/admin/all?proyectoId=${proyectoId}`, 'GET');
    }

    public static async getUsuarioAdmin(usuarioId: string): Promise<UsuarioEntity> {
        return await apiFetchServer<UsuarioEntity>(`usuario/admin/view/${usuarioId}`, 'GET');
    }

}