import { apiFetchServer } from '@/shared/api/client-server';
import { TestimoniosEntity } from '@/features';

export class TestimoniosService {

    public static async getTestimonios(proyecto_id?: string): Promise<TestimoniosEntity | null> {
        const url = proyecto_id ? `testimonios/ver-todo?proyecto_id=${proyecto_id}` : 'testimonios/ver-todo';
        return await apiFetchServer<TestimoniosEntity>(url, 'GET');
    }

}
