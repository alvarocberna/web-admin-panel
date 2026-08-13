import { ArticulosPublic, TestimoniosPublic, EquipoPublic, ServiciosPublic, NavbarPublic } from '@/features';
import { EquipoServicePublic, ServiciosServicePublic, ArticulosServicePublic, TestimoniosServicePublic } from '@/features';

export const revalidate = 300;

export default async function Project(){

    const [equipo, servicios, articulos, testimonios] = await Promise.all([
        EquipoServicePublic.getEquipo(),
        ServiciosServicePublic.getServicios(),
        ArticulosServicePublic.getArticulos(),
        TestimoniosServicePublic.getTestimonios(),
    ])

    return(
        <div className='flex flex-col'>
            <NavbarPublic/>
            <div className='h-20'></div>
            <ServiciosPublic servicios={servicios}/>
            <EquipoPublic equipo={equipo}/>
            <TestimoniosPublic dataTestimonios={testimonios}/>
            <ArticulosPublic dataArticulos={articulos}/>
        </div>
    )
}