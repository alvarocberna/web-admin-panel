
//shared
import {apiFetch} from '@/shared/api/client';
//features
import { UsuarioEntity } from '../entities/usuario.entity';
import { UpdateUsuarioInfoDto, UpdateUsuarioPasswordDto } from '../dtos/usuario.dto';

export class UsuarioService{

    /*no enviamos datos, ya que solo enviamos el id del usuario autenticado
      que se encuentra en el access_token de las cookies*/
    public static async getUsuario(): Promise<UsuarioEntity>{
        return await apiFetch<any>('usuario/authenticated', 'GET')
    }

    public static async updateUsuarioInfo(data: UpdateUsuarioInfoDto): Promise<UsuarioEntity>{
        return await apiFetch<UsuarioEntity>('usuario/me/info', 'PATCH', data)
    }

    public static async updateUsuarioPassword(data: UpdateUsuarioPasswordDto): Promise<void>{
        return await apiFetch<void>('usuario/me/password', 'PATCH', data)
    }

}