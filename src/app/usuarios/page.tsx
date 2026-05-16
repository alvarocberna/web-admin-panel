import { Suspense } from 'react'
//SHARED
import { ContenedorAdmin, TitleSec } from '@/shared'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { UsuarioService } from '@/features/usuarios/services/usuario.server.service'
import { UsuariosContent } from '@/features/usuarios/components/usuarios-content.component'

export default function UsuariosPage() {
    const usuarioPromise = UsuarioService.getUsuario()

    return (
        <ContenedorAdmin>
            <TitleSec title="Usuarios" />
            <Suspense fallback={<UsuariosSkeleton />}>
                <UsuariosContent usuarioPromise={usuarioPromise} />
            </Suspense>
        </ContenedorAdmin>
    )
}

function UsuariosSkeleton() {
    return <div className="card overflow-hidden animate-pulse h-48" />
}
