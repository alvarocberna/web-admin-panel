import { UsuarioService } from '../services/usuario.server.service'
import { UsuarioEntity } from '../entities/usuario.entity'
import { UsuarioList } from './admin-rol/usuario-list'

interface Props {
    usuarioPromise: Promise<UsuarioEntity>
}

export async function UsuariosContent({ usuarioPromise }: Props) {
    const usuario = await usuarioPromise
    const usuarios = await UsuarioService.getUsuariosAdmin(usuario.proyecto_id)

    return (
        <UsuarioList
            usuarios={usuarios}
            proyectoId={usuario.proyecto_id}
        />
    )
}
