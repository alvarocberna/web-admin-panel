import { Suspense } from 'react'
//SHARED
import { ContenedorAdmin, TitleSec } from '@/shared'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { ActividadService } from '@/features/actividad/services/actividad.server.service'
import { ActividadContent } from '@/features/actividad/components/actividad-content.component'

export default function ActividadPage() {
    const actividadesPromise = ActividadService.getActividadAll()

    return (
        <ContenedorAdmin>
            <TitleSec title="Historial de actividad" />
            <Suspense fallback={<div className="card overflow-hidden animate-pulse h-40" />}>
                <ActividadContent promise={actividadesPromise} />
            </Suspense>
        </ContenedorAdmin>
    )
}
