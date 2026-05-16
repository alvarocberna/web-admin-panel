//REACT
import { Suspense } from 'react'
//SHARED
import { ContenedorAdmin, TitleSec } from '@/shared'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { EquipoService } from '@/features/equipo/services/equipo.server.service'
import { EquipoContent } from '@/features/equipo/components/equipo-content.component'

export default function EquipoPage() {
    const equipoPromise = EquipoService.getEquipo()

    return (
        <ContenedorAdmin>
            <TitleSec title="Equipo" />
            <div className="mt-4">
                <Suspense fallback={<EquipoSkeleton />}>
                    <EquipoContent promise={equipoPromise} />
                </Suspense>
            </div>
        </ContenedorAdmin>
    )
}

function EquipoSkeleton() {
    return (
        <div className="space-y-8">
            <div className="card px-6 py-6 max-w-lg animate-pulse h-64" />
            <div className="card py-14 animate-pulse h-40 mt-8" />
        </div>
    )
}
