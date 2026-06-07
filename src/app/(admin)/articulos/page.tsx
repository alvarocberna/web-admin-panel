import { Suspense } from 'react'
//SHARED
import { TitleSec } from '@/shared'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { ArticulosService } from '@/features/articulos/services/articulos.server.service'
import { UsuarioService } from '@/features/usuarios/services/usuario.server.service'
import { ArticulosContent } from '@/features/articulos/components/articulos-content.component'

export default function ArticulosPage() {
    const articulosPromise = ArticulosService.getArticulos()
    const usuarioPromise = UsuarioService.getUsuario()

    return (
        <>
            <TitleSec title="Artículos" />
            <div className="mt-4">
                <Suspense fallback={<ArticulosSkeleton />}>
                    <ArticulosContent articulosPromise={articulosPromise} usuarioPromise={usuarioPromise} />
                </Suspense>
            </div>
        </>
    )
}

function ArticulosSkeleton() {
    return (
        <div className="space-y-8">
            <div className="card px-6 py-6 max-w-lg animate-pulse h-72" />
            <div className="card py-14 animate-pulse h-40 mt-8" />
        </div>
    )
}
