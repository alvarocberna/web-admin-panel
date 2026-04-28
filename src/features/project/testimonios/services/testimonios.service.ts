import { apiFetch } from '@/shared/api/client';
import { TestimoniosEntity } from '../entities/testimonios.entity';
import { CreateTestimonioDto } from '../dtos/create-testimonio.dto';

export class TestimoniosService {

    public static async getTestimonios(): Promise<TestimoniosEntity | null> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetch<TestimoniosEntity>(`testimonios/project/ver-todo?proyecto_id=${id_proyecto}`, 'GET');
    }

    public static async createTestimonio(data: Omit<CreateTestimonioDto, never>): Promise<void> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        await apiFetch<void>(`testimonios/project/testimonio/crear?proyecto_id=${id_proyecto}`, 'POST', data);
    }

}
