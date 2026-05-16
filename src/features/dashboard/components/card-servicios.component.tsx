
import { ServiciosEntity } from "@/features"

interface CardServiciosProps {
    promise: Promise<ServiciosEntity | null>
}

export async function CardServicios({ promise }: CardServiciosProps) {
    const servicios = await promise
    const totalServicios = servicios?.servicio?.length ?? 0

    return (
        <div className="card px-6 py-6">
            <p className="text-base font-semibold text-zinc-900 mb-3">Servicios</p>
            <p className="text-sm text-zinc-600">
                {totalServicios} {totalServicios === 1 ? 'servicio' : 'servicios'}
            </p>
        </div>
    )
}
