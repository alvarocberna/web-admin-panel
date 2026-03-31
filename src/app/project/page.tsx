import { Articulos, ListaTestimonios, EquipoPublic, ServiciosPublic, NuevoTestimonio } from '@/features/project';

export default function Project(){
    return(
        <div className='flex flex-col'>
            <EquipoPublic/>
            <ServiciosPublic/>
            <Articulos/>
            <ListaTestimonios/>
            <NuevoTestimonio/>
        </div>
    )
}