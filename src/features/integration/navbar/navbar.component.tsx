import { EquipoServicePublic, ServiciosServicePublic, ArticulosServicePublic, TestimoniosServicePublic, NavbarInnerPublic } from '@/features';

export async function NavbarPublic(){

    const [equipo, servicios, articulos, testimonios] = await Promise.all([
        EquipoServicePublic.getEquipo(),
        ServiciosServicePublic.getServicios(),
        ArticulosServicePublic.getArticulos(),
        TestimoniosServicePublic.getTestimonios(),
    ])

    return(
        <div className='flex flex-col'>
            <NavbarInnerPublic equipo={equipo} servicios={servicios} articulos={articulos} testimonios={testimonios} />
        </div>
    )
}