
//NEXT
import Link from "next/link"
//FEATURES
import { ArticulosEntity, UsuarioEntity } from "@/features"

interface CardArticulosProps {
    articulosPromise: Promise<ArticulosEntity | null>
    usuarioPromise: Promise<UsuarioEntity>
}

export async function CardArticulos({ articulosPromise, usuarioPromise }: CardArticulosProps) {
    const [articulos, usuario] = await Promise.all([articulosPromise, usuarioPromise])

    const totalArticulos = articulos?.articulo?.length ?? 0
    const pendientesArticulos = articulos?.articulo?.filter(a => a.status === 'pending').length ?? 0

    return (
        <div className="card px-6 py-6">
            <p className="text-base font-semibold text-zinc-900 mb-3">Artículos</p>
            <p className="text-sm text-zinc-600">
                {totalArticulos} {totalArticulos === 1 ? 'artículo' : 'artículos'}
            </p>
            {(usuario?.rol === 'ADMIN' || usuario?.rol === 'SUPERADMIN') && (
                <Link
                    href="/articulos"
                    className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                >
                    {pendientesArticulos} pendiente{pendientesArticulos !== 1 ? 's' : ''} de aprobación →
                </Link>
            )}
        </div>
    )
}
