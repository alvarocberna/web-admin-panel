//FEATURES
import { EquipoEntity, EquipoForm, EmpleadoList } from '@/features';

interface Props {
    promise: Promise<EquipoEntity | null>
}

export async function EquipoContent({ promise }: Props) {
    const equipo = await promise

    return (
        <>
            <EquipoForm equipo={equipo} />
            {equipo && (
                <EmpleadoList empleados={equipo.empleado ?? []} />
            )}
        </>
    )
}
