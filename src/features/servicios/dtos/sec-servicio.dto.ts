//SEC-SERVICIO - ENTIDAD NIETA JAJ
export abstract class CreateSecServicioDto{
        abstract nroSeccion: number;
        abstract tituloSec: string | null;
        abstract contenidoSec: string | null;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
}

export abstract class UpdateSecServicioDto{
        abstract id: string;
        abstract nroSeccion: number;
        abstract tituloSec: string | null;
        abstract contenidoSec: string | null;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
}