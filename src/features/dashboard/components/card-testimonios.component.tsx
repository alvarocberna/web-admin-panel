
//NEXT
import Link from "next/link"
//FEATURES
import { TestimoniosEntity, UsuarioEntity } from "@/features"

interface CardTestimoniosProps {
    testimoniosPromise: Promise<TestimoniosEntity | null>
    usuarioPromise: Promise<UsuarioEntity>
}

export async function CardTestimonios({ testimoniosPromise, usuarioPromise }: CardTestimoniosProps) {
    const [testimonios, usuario] = await Promise.all([testimoniosPromise, usuarioPromise])

    const totalTestimonios = testimonios?.testimonio?.length ?? 0
    const pendientesTestimonios = testimonios?.testimonio?.filter(t => t.status === 'pending').length ?? 0

    return (
        <div className="card px-6 py-6">
            <p className="text-base font-semibold text-zinc-900 mb-3">Testimonios</p>
            <p className="text-sm text-zinc-600">
                {totalTestimonios} {totalTestimonios === 1 ? 'testimonio' : 'testimonios'}
            </p>
            {(usuario?.rol === 'ADMIN' || usuario?.rol === 'SUPERADMIN') && (
                <Link
                    href="/testimonios"
                    className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                >
                    {pendientesTestimonios} pendiente{pendientesTestimonios !== 1 ? 's' : ''} de aprobación →
                </Link>
            )}
        </div>
    )
}
