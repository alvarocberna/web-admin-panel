import { Suspense } from 'react'
//SHARED
import { TitleSec } from '@/shared'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { UsuarioService } from '@/features/usuarios/services/usuario.server.service'
import { PerfilContent } from '@/features/usuarios/components/perfil-content.component'

export default function PerfilPage() {
    const usuarioPromise = UsuarioService.getUsuario()

    return (
        <>
            <TitleSec title="Mi perfil" />
            <Suspense fallback={<PerfilSkeleton />}>
                <PerfilContent promise={usuarioPromise} />
            </Suspense>
        </>
    )
}

function PerfilSkeleton() {
    return (
        <div className="flex flex-col gap-6 max-w-lg">
            <div className="card px-6 py-6 animate-pulse h-56" />
            <div className="card px-6 py-6 animate-pulse h-40" />
        </div>
    )
}
