import { apiFetch } from '@/shared/api/client';
import { TestimoniosEntity } from '../entities/testimonios.entity';

export class TestimoniosService {

    public static async getTestimonios(): Promise<TestimoniosEntity | null> {
        const id_usuario = process.env.NEXT_PUBLIC_ID_USUARIO;
        return await apiFetch<TestimoniosEntity>(`testimonios/project/ver-todo?usuario_id=${id_usuario}`, 'GET');
    }

}
