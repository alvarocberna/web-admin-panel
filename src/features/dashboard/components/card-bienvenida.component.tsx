
import { UsuarioEntity } from "@/features"

interface CardBienvenidaProps {
    promise: Promise<UsuarioEntity>
}

export async function CardBienvenida({ promise }: CardBienvenidaProps) {
    const usuario = await promise
    return (
        <div className="card px-6 py-7 w-full">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-1">Bienvenido</p>
            <h2 className="text-xl font-semibold text-zinc-900">
                {usuario?.nombre ? `${usuario.nombre} ${usuario.apellido ?? ''}` : usuario?.email ?? '—'}
            </h2>
            {usuario?.email && usuario?.nombre && (
                <p className="text-sm text-zinc-500 mt-0.5">{usuario.email}</p>
            )}
        </div>
    )
}
