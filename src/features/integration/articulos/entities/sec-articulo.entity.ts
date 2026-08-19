
export class SecArticuloEntityPublic {
    constructor(
        public id: string,
        public nroSeccion: number,
        public tituloSec: string,
        public contenidoSec: string,
        public imageUrl: string | null,
        public imageAlt: string | null,
        public imagePosition: string | null,
        public articuloId: string,
        public proyectoId: string,
    ){}
}