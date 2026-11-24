
export abstract class CreateSecArticuloDtoPublic{
        abstract nroSeccion: number;
        abstract tituloSec: string;
        abstract contenidoSec: string;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
}

export abstract class UpdateSecArticuloDtoPublic{
        abstract nroSeccion: number;
        abstract tituloSec: string;
        abstract contenidoSec: string;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
}