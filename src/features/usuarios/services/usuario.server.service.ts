
//shared
import {apiFetchServer} from '@/shared/api/client-server';
//features
import { UsuarioEntity } from '../entities/usuario.entity';

export class UsuarioService{

    public static async getUsuario(): Promise<UsuarioEntity>{
        return await apiFetchServer<any>('usuario/user/authenticated', 'GET')
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    public static async getUsuariosAdmin(proyecto_id: string): Promise<UsuarioEntity[]> {
        return await apiFetchServer<UsuarioEntity[]>(`usuario/admin/ver-todo?proyecto_id=${proyecto_id}`, 'GET');
    }

    public static async getUsuarioAdmin(usuario_id: string): Promise<UsuarioEntity> {
        return await apiFetchServer<UsuarioEntity>(`usuario/admin/ver/${usuario_id}`, 'GET');
    }

}