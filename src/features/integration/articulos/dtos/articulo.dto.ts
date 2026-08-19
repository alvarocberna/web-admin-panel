
import {CreateSecArticuloDtoPublic, UpdateSecArticuloDtoPublic} from './sec-articulo.dto';

export abstract class CreateArticuloFullDtoPublic {
        abstract articulo: CreateArticuloDtoPublic;
        abstract secArticulo: CreateSecArticuloDtoPublic[]
}

export abstract class CreateArticuloDtoPublic{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fechaPublicacion: Date;
        abstract fechaActualizacion: Date | null;
        abstract status: string;
        abstract activo: boolean;
        abstract slug: string;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
        abstract secArticulo: CreateSecArticuloDtoPublic[]
}

export abstract class UpdateArticuloDtoPublic{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fechaPublicacion: Date;
        abstract fechaActualizacion: Date | null;
        abstract status: string;
        abstract activo: boolean;
        abstract slug: string;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
        abstract secArticulo: UpdateSecArticuloDtoPublic[]
}