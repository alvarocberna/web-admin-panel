import { TestimoniosEntity } from '../entities/testimonios.entity'
import { TestimoniosForm } from './testimonios-form'
import { TestimonioList } from './testimonio-list'

interface Props {
    promise: Promise<TestimoniosEntity | null>
}

export async function TestimoniosContent({ promise }: Props) {
    const testimonios = await promise

    return (
        <>
            <TestimoniosForm testimonios={testimonios} />
            <TestimonioList testimonios={testimonios?.testimonio ?? []} />
        </>
    )
}
