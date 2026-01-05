
//shared
import {apiFetch} from '@/shared/api/client';
//features
import { UsuarioEntity } from '../entities/usuario.entity';

export class UsuarioService{

    /*no enviamos datos, ya que solo enviamos el id del usuario autenticado 
      que se encuentra en el access_token de las cookies*/
    public static async getUsuario(): Promise<UsuarioEntity>{
        return await apiFetch<any>('usuario/authenticated', 'GET')
    }

}