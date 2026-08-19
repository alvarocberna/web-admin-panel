import { ServicioEntityPublic } from './servicio.entity';

export class ServiciosEntityPublic {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string | null,
        public icono: string | null,
        public activo: boolean,
        public notificacion: boolean,
        public habilitado: boolean,
        public proyectoId: string,
        public servicio: ServicioEntityPublic[],
    ) {}
}
