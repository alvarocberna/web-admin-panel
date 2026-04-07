import { ArticulosPublic, TestimoniosPublic, EquipoPublic, ServiciosPublic } from '@/features/project';

export default function Project(){
    return(
        <div className='flex flex-col'>
            <EquipoPublic/>
            <ServiciosPublic/>
            <ArticulosPublic/>
            <TestimoniosPublic/>
        </div>
    )
}