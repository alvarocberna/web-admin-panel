export abstract class CreateServicioDto {
    abstract nombreServicio: string;
    abstract descripcion: string | null;
    abstract valor: number | null;
    abstract nombrePromocion: string | null;
    abstract porcentajeDescuento: number | null;
    abstract destacado: boolean;
    abstract icono: string | null;
    abstract orden: string | null;
    abstract activo: boolean;
    abstract slug: string;
    abstract imgUrl: string | null;
    abstract imgAlt: string | null;
}

export abstract class UpdateServicioDto {
    abstract nombreServicio?: string;
    abstract descripcion?: string;
    abstract valor?: number;
    abstract nombrePromocion?: string;
    abstract porcentajeDescuento?: number;
    abstract destacado?: boolean;
    abstract icono?: string;
    abstract orden?: string;
    abstract activo?: boolean;
    abstract slug?: string;
    abstract imgUrl?: string;
    abstract imgAlt?: string;
}
