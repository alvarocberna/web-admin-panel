export abstract class CreateServicioDto {
    abstract nombre_servicio: string;
    abstract descripcion: string | null;
    abstract valor: string | null;
    abstract nombre_promocion: string | null;
    abstract porcentaje_descuento: string | null;
    abstract destacado: boolean;
    abstract icono: string | null;
    abstract orden: string | null;
    abstract activo: boolean;
    abstract img_url: string | null;
    abstract img_alt: string | null;
}

export abstract class UpdateServicioDto {
    abstract nombre_servicio?: string;
    abstract descripcion?: string;
    abstract valor?: string;
    abstract nombre_promocion?: string;
    abstract porcentaje_descuento?: string;
    abstract destacado?: boolean;
    abstract icono?: string;
    abstract orden?: string;
    abstract activo?: boolean;
    abstract img_url?: string;
    abstract img_alt?: string;
}
