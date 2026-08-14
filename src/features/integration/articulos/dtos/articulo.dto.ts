
import {CreateSecArticuloDtoPublic, UpdateSecArticuloDtoPublic} from './sec-articulo.dto';

export abstract class CreateArticuloFullDtoPublic {
        abstract articulo: CreateArticuloDtoPublic;
        abstract sec_articulo: CreateSecArticuloDtoPublic[]
}

export abstract class CreateArticuloDtoPublic{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract activo: boolean;
        abstract slug: string;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
        abstract sec_articulo: CreateSecArticuloDtoPublic[]
}

export abstract class UpdateArticuloDtoPublic{
        abstract titulo: string;
        abstract subtitulo: string;
        abstract autor: string;
        abstract fecha_publicacion: Date;
        abstract fecha_actualizacion: Date | null;
        abstract status: string;
        abstract activo: boolean;
        abstract slug: string;
        abstract image_url: string | null;
        abstract image_alt: string | null;
        abstract image_position: string | null;
        abstract sec_articulo: UpdateSecArticuloDtoPublic[]
}