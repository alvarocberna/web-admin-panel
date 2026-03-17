import { apiFetch } from '@/shared/api/client';
import { TestimoniosEntity } from '../entities/testimonios.entity';

export class TestimoniosService {

    public static async getTestimonios(): Promise<TestimoniosEntity | null> {
        return await apiFetch<TestimoniosEntity>('testimonios/ver-todo', 'GET');
    }

}
