//FEATURES
import { ServiciosPublic, ServiciosServicePublic } from '@/features';

export default async function ProjectServiciosPage() {

    const [servicios] = await Promise.all([
        ServiciosServicePublic.getServicios()
    ])

    return (
        <div className="flex flex-col">
            <ServiciosPublic servicios={servicios} comportamiento='navegar'/>
        </div>
    );
}
