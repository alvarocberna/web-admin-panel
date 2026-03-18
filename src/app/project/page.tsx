import { Articulos, ListaTestimonios, ProyectoEquipo, ProyectoServicios } from '@/features/project';

export default function Project(){
    return(
        <div className='flex flex-col'>
            <Articulos/>
            <ListaTestimonios/>
            <ProyectoEquipo/>
            <ProyectoServicios/>
        </div>
    )
}