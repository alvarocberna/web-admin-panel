import { apiFetch } from '@/shared/api/client';
import { TestimoniosEntity } from '../entities/testimonios.entity';
import { CreateTestimoniosDto, UpdateTestimoniosDto } from '../dtos/testimonios.dto';

export class TestimoniosService {

    public static async createTestimonios(data: CreateTestimoniosDto, proyectoId?: string): Promise<TestimoniosEntity> {
        const url = proyectoId ? `testimonios/create?proyectoId=${proyectoId}` : 'testimonios/create';
        return await apiFetch<TestimoniosEntity>(url, 'POST', data);
    }

    public static async getTestimonios(proyectoId?: string): Promise<TestimoniosEntity | null> {
        const url = proyectoId ? `testimonios/all?proyectoId=${proyectoId}` : 'testimonios/all';
        return await apiFetch<TestimoniosEntity>(url, 'GET');
    }

    public static async updateTestimonios(data: UpdateTestimoniosDto, proyectoId?: string): Promise<TestimoniosEntity> {
        const url = proyectoId ? `testimonios/update?proyectoId=${proyectoId}` : 'testimonios/update';
        return await apiFetch<TestimoniosEntity>(url, 'PATCH', data);
    }

}
