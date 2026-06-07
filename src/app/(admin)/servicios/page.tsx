import { Suspense } from 'react'
//SHARED
import { TitleSec } from '@/shared'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { ServiciosService } from '@/features/servicios/services/servicios.server.service'
import { ServiciosContent } from '@/features/servicios/components/servicios-content.component'

export default function ServiciosPage() {
    const serviciosPromise = ServiciosService.getServicios()

    return (
        <>
            <TitleSec title="Servicios" />
            <div className="mt-4">
                <Suspense fallback={<ServiciosSkeleton />}>
                    <ServiciosContent promise={serviciosPromise} />
                </Suspense>
            </div>
        </>
    )
}

function ServiciosSkeleton() {
    return (
        <div className="space-y-8">
            <div className="card px-6 py-6 max-w-lg animate-pulse h-64" />
            <div className="card py-14 animate-pulse h-40 mt-8" />
        </div>
    )
}
