//SEC-SERVICIO - ENTIDAD NIETA JAJ
export abstract class CreateSecServicioDto{
        abstract nro_seccion: number;
        abstract titulo_sec: string | null;
        abstract contenido_sec: string | null;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}

export abstract class UpdateSecServicioDto{
        abstract id: string;
        abstract nro_seccion: number;
        abstract titulo_sec: string | null;
        abstract contenido_sec: string | null;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
}