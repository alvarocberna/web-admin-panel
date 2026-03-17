import { apiFetch } from '@/shared/api/client';
import { TestimoniosEntity } from '../entities/testimonios.entity';
import { CreateTestimoniosDto, UpdateTestimoniosDto } from '../dtos/testimonios.dto';

export class TestimoniosService {

    public static async createTestimonios(data: CreateTestimoniosDto): Promise<TestimoniosEntity> {
        return await apiFetch<TestimoniosEntity>('testimonios/crear', 'POST', data);
    }

    public static async getTestimonios(): Promise<TestimoniosEntity | null> {
        return await apiFetch<TestimoniosEntity>('testimonios/ver-todo', 'GET');
    }

    public static async updateTestimonios(data: UpdateTestimoniosDto): Promise<TestimoniosEntity> {
        return await apiFetch<TestimoniosEntity>('testimonios/editar', 'PUT', data);
    }

}
