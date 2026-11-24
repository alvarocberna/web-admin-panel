export class TestimonioEntityPublic {
    constructor(
        public id: string,
        public nombre: string,
        public apellido: string,
        public correo: string,
        public descripcion: string,
        public calificacion: number,
        public status: string,
        public fechaCreacion: Date,
        public testimoniosId: string,
    ){}
}
