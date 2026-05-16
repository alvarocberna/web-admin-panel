
import { EquipoEntity } from "@/features"

interface CardEquipoProps {
    promise: Promise<EquipoEntity | null>
}

export async function CardEquipo({ promise }: CardEquipoProps) {
    const equipo = await promise
    const totalEmpleados = equipo?.empleado?.length ?? 0

    return (
        <div className="card px-6 py-6">
            <p className="text-base font-semibold text-zinc-900 mb-3">Equipo</p>
            <p className="text-sm text-zinc-600">
                {totalEmpleados} {totalEmpleados === 1 ? 'empleado' : 'empleados'}
            </p>
        </div>
    )
}
