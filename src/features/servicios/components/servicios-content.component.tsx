import { ServiciosEntity } from '../entities/servicios.entity'
import { ServiciosForm } from './servicios-form'
import { ServicioList } from './servicio-list'

interface Props {
    promise: Promise<ServiciosEntity | null>
}

export async function ServiciosContent({ promise }: Props) {
    const servicios = await promise

    return (
        <>
            <ServiciosForm servicios={servicios} />
            {servicios && (
                <ServicioList
                    servicios={servicios.servicio ?? []}
                />
            )}
        </>
    )
}
