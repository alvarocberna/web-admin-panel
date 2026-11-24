import { SecArticuloEntityPublic } from "./sec-articulo.entity";

export class ArticuloEntityPublic{
    constructor(
        public id: string,
        public nroArticulo: number,
        public titulo: string,
        public subtitulo: string,
        public autor: string,
        public fechaPublicacion: Date,
        public fechaActualizacion: Date | null,
        public status: string,
        public activo: boolean,
        public slug: string,
        public imageUrl: string | null,
        public imageAlt: string | null,
        public imagePosition: string | null,
        public autorId: string,
        public proyectoId: string,
        public secArticulo: SecArticuloEntityPublic[],
    ){}
}