import { apiFetch } from '@/shared/api/client';
import { TestimoniosEntity } from '../entities/testimonios.entity';
import { CreateTestimoniosDto, UpdateTestimoniosDto } from '../dtos/testimonios.dto';

export class TestimoniosService {

    public static async createTestimonios(data: CreateTestimoniosDto, proyecto_id?: string): Promise<TestimoniosEntity> {
        const url = proyecto_id ? `testimonios/crear?proyecto_id=${proyecto_id}` : 'testimonios/crear';
        return await apiFetch<TestimoniosEntity>(url, 'POST', data);
    }

    public static async getTestimonios(proyecto_id?: string): Promise<TestimoniosEntity | null> {
        const url = proyecto_id ? `testimonios/ver-todo?proyecto_id=${proyecto_id}` : 'testimonios/ver-todo';
        return await apiFetch<TestimoniosEntity>(url, 'GET');
    }

    public static async updateTestimonios(data: UpdateTestimoniosDto, proyecto_id?: string): Promise<TestimoniosEntity> {
        const url = proyecto_id ? `testimonios/editar?proyecto_id=${proyecto_id}` : 'testimonios/editar';
        return await apiFetch<TestimoniosEntity>(url, 'PUT', data);
    }

}
