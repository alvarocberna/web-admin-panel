import { apiFetch } from '@/shared/api/client';
import { TestimoniosEntityPublic } from '../entities/testimonios.entity';
import { CreateTestimonioDtoPublic } from '../dtos/create-testimonio.dto';

export class TestimoniosServicePublic {

    public static async getTestimonios(): Promise<TestimoniosEntityPublic | null> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetch<TestimoniosEntityPublic>(`testimonios/project/ver-todo?proyecto_id=${id_proyecto}`, 'GET');
    }

    public static async createTestimonio(data: Omit<CreateTestimonioDtoPublic, never>): Promise<void> {
        const id_proyecto = process.env.NEXT_PUBLIC_PROYECTO_ID;
        await apiFetch<void>(`testimonios/project/testimonio/crear?proyecto_id=${id_proyecto}`, 'POST', data);
    }

}
