import { Articulos, ListaTestimonios, ProyectoEquipo } from '@/features/project';

export default function Project(){
    return(
        <div className='flex flex-col'>
            <Articulos/>
            <ListaTestimonios/>
            <ProyectoEquipo/>
        </div>
    )
}