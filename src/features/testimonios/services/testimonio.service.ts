import { apiFetch } from '@/shared/api/client';
import { TestimonioEntity } from '../entities/testimonio.entity';
import { CreateTestimonioDto, UpdateTestimonioDto } from '../dtos/testimonio.dto';

export class TestimonioService {

    public static async createTestimonio(data: CreateTestimonioDto): Promise<TestimonioEntity> {
        return await apiFetch<TestimonioEntity>(`testimonios/testimonio/crear`, 'POST', data);
    }

    public static async deleteTestimonio(id_testimonio: string): Promise<void> {
        return await apiFetch<void>(`testimonios/testimonio/eliminar/${id_testimonio}`, 'DELETE');
    }
    
}
