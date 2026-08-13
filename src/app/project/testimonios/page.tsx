//FEATURES
import { TestimoniosAllPublic, TestimoniosServicePublic } from '@/features';

export default async function ProjectServiciosPage() {

    const [testimonios] = await Promise.all([
        TestimoniosServicePublic.getTestimonios()
    ])

    return (
        <div className="flex flex-col">
            <TestimoniosAllPublic dataTestimonios={testimonios}/>
        </div>
    );
}
