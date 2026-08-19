
import {CreateSecArticuloDto, UpdateSecArticuloDto} from './sec-articulo.dto';

export abstract class CreateArticuloFullDto {
        abstract articulo: CreateArticuloDto;
        abstract secArticulo: CreateSecArticuloDto[] 
}

export abstract class CreateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string | null;
        abstract autor: string;
        abstract fechaPublicacion: Date;
        abstract fechaActualizacion: Date | null;
        abstract status: string;
        abstract activo: boolean;
        abstract slug: string;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
        abstract secArticulo: CreateSecArticuloDto[] 
}

export abstract class UpdateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string | null;
        abstract autor: string;
        abstract fechaPublicacion: Date;
        abstract fechaActualizacion: Date | null;
        abstract status: string;
        abstract activo: boolean;
        abstract slug: string;  
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
        abstract secArticulo: UpdateSecArticuloDto[] 
}