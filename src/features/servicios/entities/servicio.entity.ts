export class ServicioEntity {
    constructor(
        public id: string,
        public nombre_servicio: string,
        public descripcion: string | null,
        public valor: string | null,
        public nombre_promocion: string | null,
        public porcentaje_descuento: string | null,
        public destacado: boolean | null,
        public icono: string | null,
        public orden: string | null,
        public activo: boolean,
        public img_url: string | null,
        public img_alt: string | null,
        public servicios_id: string,
    ) {}
}
