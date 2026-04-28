import { EquipoService, ServiciosService, ArticulosService, TestimoniosService, NavbarInner } from '@/features';

export async function NavbarPublic(){

    const [equipo, servicios, articulos, testimonios] = await Promise.all([
        EquipoService.getEquipo(),
        ServiciosService.getServicios(),
        ArticulosService.getArticulos(),
        TestimoniosService.getTestimonios(),
    ])

    return(
        <div className='flex flex-col'>
            <NavbarInner equipo={equipo} servicios={servicios} articulos={articulos} testimonios={testimonios} />
        </div>
    )
}