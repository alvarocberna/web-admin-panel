
import {CreateSecArticuloDto, UpdateSecArticuloDto} from './sec-articulo.dto';

export abstract class CreateArticuloFullDto {
        abstract articulo: CreateArticuloDto;
        abstract sec_articulo: CreateSecArticuloDto[] 
}

export abstract class CreateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract slug: string;
        abstract autor_id: string;
        abstract sec_articulo: CreateSecArticuloDto[] 
}

export abstract class UpdateArticuloDto{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract slug: string;  
        abstract autor_id: string;
        abstract sec_articulo: UpdateSecArticuloDto[] 
}