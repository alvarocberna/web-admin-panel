import { UsuarioEntity, ArticuloEntity } from "@/features";

export class ActividadEntity{
    constructor(
        public id: string,
        public accion: string,
        public tituloArticulo: string,
        public responsable: string,
        public fecha: string,
        public proyectoId: string,
        public articuloId: string,
        public articulo: ArticuloEntity
    ){}
}