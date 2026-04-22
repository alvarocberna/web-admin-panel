import { ArticulosPublic, TestimoniosPublic, EquipoPublic, ServiciosPublic } from '@/features/project';
import { EquipoService, ServiciosService, ArticulosService, TestimoniosService } from '@/features/project';

export const revalidate = 300;

export default async function Project(){

    const [equipo, servicios, articulos, testimonios] = await Promise.all([
        EquipoService.getEquipo(),
        ServiciosService.getServicios(),
        ArticulosService.getArticulos(),
        TestimoniosService.getTestimonios(),
    ])

    return(
        <div className='flex flex-col'>
            <ServiciosPublic dataServicios={servicios}/>
            <EquipoPublic dataEquipo={equipo}/>
            <TestimoniosPublic dataTestimonios={testimonios}/>
            <ArticulosPublic dataArticulos={articulos}/>
        </div>
    )
}