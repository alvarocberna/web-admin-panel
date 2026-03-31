export abstract class CreateTestimoniosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract activo: boolean;
    abstract aprobar: boolean;
    abstract notificacion: boolean;
    abstract habilitado: boolean;
}

export abstract class UpdateTestimoniosDto {
    abstract titulo?: string;
    abstract descripcion?: string;
    abstract activo?: boolean;
    abstract aprobar?: boolean;
    abstract notificacion?: boolean;
    abstract habilitado?: boolean;
}
