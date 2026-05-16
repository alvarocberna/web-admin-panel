import { Suspense } from 'react'
//SHARED
import { ContenedorAdmin, TitleSec } from '@/shared'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { TestimoniosService } from '@/features/testimonios/services/testimonios.server.service'
import { TestimoniosContent } from '@/features/testimonios/components/testimonios-content.component'

export default function TestimoniosPage() {
    const testimoniosPromise = TestimoniosService.getTestimonios()

    return (
        <ContenedorAdmin>
            <TitleSec title="Testimonios" />
            <div className="mt-4">
                <Suspense fallback={<TestimoniosSkeleton />}>
                    <TestimoniosContent promise={testimoniosPromise} />
                </Suspense>
            </div>
        </ContenedorAdmin>
    )
}

function TestimoniosSkeleton() {
    return (
        <div className="space-y-8">
            <div className="card px-6 py-6 max-w-lg animate-pulse h-64" />
            <div className="card py-14 animate-pulse h-40 mt-8" />
        </div>
    )
}
