
import { UsuarioEntity } from "@/features"
import { ProyectoService } from "@/features/proyectos/services/proyecto.server.service"

interface CardProyectoProps {
    promise: Promise<UsuarioEntity>
}

export async function CardProyecto({ promise }: CardProyectoProps) {
    const usuario = await promise
    const proyecto = usuario?.proyecto_id
        ? await ProyectoService.getProyecto(usuario.proyecto_id)
        : null

    return (
        <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-2">Proyecto</p>
            <div className="card px-6 py-5 w-full">
                <p className="text-lg font-semibold text-zinc-900 mb-1">
                    {proyecto?.nombre_proyecto ?? '—'}
                </p>
                <p className="text-sm text-zinc-500">
                    Estado:{' '}
                    <span className={proyecto?.activo ? 'text-green-600 font-medium' : 'text-zinc-400 font-medium'}>
                        {proyecto ? (proyecto.activo ? 'Activo' : 'Inactivo') : '—'}
                    </span>
                </p>
            </div>
        </div>
    )
}
