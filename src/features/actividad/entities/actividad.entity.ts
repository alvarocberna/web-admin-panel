import { UsuarioEntity, ArticuloEntity } from "@/features";

export class ActividadEntity{
    constructor(
        public id: string,
        public accion: string,
        public titulo_articulo: string,
        public responsable: string,
        public fecha: string,
        public proyecto_id: string,
        public usuario_id: string,
        public articulo_id: string,
        public usuario: UsuarioEntity,
        public articulo: ArticuloEntity
    ){}
}