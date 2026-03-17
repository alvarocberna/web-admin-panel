import {Articulos} from '@/features/project';
import { ListaTestimonios } from '@/features/project';

export default function Project(){
    return(
        <div className='flex flex-col'>
            <Articulos/>
            <ListaTestimonios/>
        </div>
    )
}