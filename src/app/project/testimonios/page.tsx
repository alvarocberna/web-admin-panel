//FEATURES
import { TestimoniosAllPublic, TestimoniosService } from '@/features/project';

export default async function ProjectServiciosPage() {

    const [testimonios] = await Promise.all([
        TestimoniosService.getTestimonios()
    ])

    return (
        <div className="flex flex-col">
            <TestimoniosAllPublic dataTestimonios={testimonios}/>
        </div>
    );
}
