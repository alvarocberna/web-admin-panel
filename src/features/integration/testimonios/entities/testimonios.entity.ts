import { TestimonioEntityPublic } from "./testimonio.entity";

export class TestimoniosEntityPublic {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string,
        public activo: boolean,
        public aprobar: boolean,
        public notificacion: boolean,
        public proyectoId: string,
        public testimonio: TestimonioEntityPublic[],
    ){}
}
