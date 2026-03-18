export abstract class CreateServiciosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract icono: string | null;
    abstract activo: string;
}

export abstract class UpdateServiciosDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract icono: string | null;
    abstract activo: string;
}
