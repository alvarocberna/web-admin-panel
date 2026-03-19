import { TestimonioEntity } from "./testimonio.entity";

export class TestimoniosEntity {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string,
        public activo: boolean,
        public aprobar: boolean,
        public proyecto_id: string,
        public testimonio: TestimonioEntity[],
    ){}
}
