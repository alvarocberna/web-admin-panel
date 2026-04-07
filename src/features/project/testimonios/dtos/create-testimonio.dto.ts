export abstract class CreateTestimonioDto {
    abstract nombre: string;
    abstract apellido: string;
    abstract correo: string;
    abstract descripcion: string;
    abstract calificacion: number | null;
    abstract status: string;
}
