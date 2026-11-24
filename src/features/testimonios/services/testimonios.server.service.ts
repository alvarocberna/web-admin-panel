import { apiFetchServer } from '@/shared/api/client-server';
import { TestimoniosEntity } from '@/features';

export class TestimoniosService {

    public static async getTestimonios(proyectoId?: string): Promise<TestimoniosEntity | null> {
        const url = proyectoId ? `testimonios/all?proyectoId=${proyectoId}` : 'testimonios/all';
        return await apiFetchServer<TestimoniosEntity>(url, 'GET');
    }

}
