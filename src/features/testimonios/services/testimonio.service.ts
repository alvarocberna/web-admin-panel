import { apiFetch } from '@/shared/api/client';
import { TestimonioEntity } from '../entities/testimonio.entity';
import { CreateTestimonioDto, UpdateTestimonioDto } from '../dtos/testimonio.dto';
import { TestimoniosService } from './testimonios.service';

export class TestimonioService {

    public static async createTestimonio(data: CreateTestimonioDto): Promise<TestimonioEntity> {
        const testimonios = await TestimoniosService.getTestimonios();
        const status = testimonios?.aprobar ? 'pending' : 'approved';
        return await apiFetch<TestimonioEntity>(`testimonios/testimonio/crear`, 'POST', { ...data, status });
    }

    public static async deleteTestimonio(id_testimonio: string): Promise<void> {
        return await apiFetch<void>(`testimonios/testimonio/eliminar/${id_testimonio}`, 'DELETE');
    }
    
}
