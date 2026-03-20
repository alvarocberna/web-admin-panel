export abstract class CreateTestimonioDto {
    abstract nombre: string;
    abstract apellido: string;
    abstract correo: string;
    abstract descripcion: string;
    abstract calificacion: number;
    abstract status: string;
}

export abstract class UpdateTestimonioDto {
    abstract nombre: string;
    abstract apellido: string;
    abstract correo: string;
    abstract descripcion: string;
    abstract calificacion: number;
    abstract status: string;
}
