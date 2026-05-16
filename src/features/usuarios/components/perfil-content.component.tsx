import { UsuarioEntity } from '../entities/usuario.entity'
import { PerfilUsuario } from './user-rol/perfil-usuario.component'

interface Props {
    promise: Promise<UsuarioEntity>
}

export async function PerfilContent({ promise }: Props) {
    const usuario = await promise

    return <PerfilUsuario usuario={usuario} />
}
