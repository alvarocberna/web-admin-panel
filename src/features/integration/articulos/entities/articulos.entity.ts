import { ArticuloEntityPublic } from "./articulo.entity";

export class ArticulosEntityPublic {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string | null,
        public activo: boolean,
        public aprobar: boolean,
        public notificacion: boolean,
        public proyectoId: string,
        public articulo: ArticuloEntityPublic[],
    ) {}
}
