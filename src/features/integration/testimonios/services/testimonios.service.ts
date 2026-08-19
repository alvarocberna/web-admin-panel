import { apiFetchCMS } from '@/shared';
import { TestimoniosEntityPublic } from '../entities/testimonios.entity';
import { CreateTestimonioDtoPublic } from '../dtos/create-testimonio.dto';

export class TestimoniosServicePublic {

    public static async getTestimonios(): Promise<TestimoniosEntityPublic | null> {
        const proyectoId = process.env.NEXT_PUBLIC_PROYECTO_ID;
        return await apiFetchCMS<TestimoniosEntityPublic>(`testimonios/project/all?proyectoId=${proyectoId}`, 'GET');
    }

    public static async createTestimonio(data: Omit<CreateTestimonioDtoPublic, never>): Promise<void> {
        const proyectoId = process.env.NEXT_PUBLIC_PROYECTO_ID;
        await apiFetchCMS<void>(`testimonios/project/testimonio/create?proyectoId=${proyectoId}`, 'POST', data);
    }

}
