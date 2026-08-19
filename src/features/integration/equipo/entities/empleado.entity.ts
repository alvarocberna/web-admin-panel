import {SecEmpleadoEntityPublic} from './sec-empleado.entity';

export class EmpleadoEntityPublic {
    constructor(
        public id: string,
        public nombrePrimero: string,
        public nombreSegundo: string | null,
        public apellidoPaterno: string,
        public apellidoMaterno: string | null,
        public profesion: string | null,
        public especialidad: string | null,
        public descripcion: string | null,
        public orden: string | null,
        public activo: boolean,
        public slug: string,
        public imgUrl: string | null,
        public imgAlt: string | null,
        public equipoId: string,
        public secEmpleado: SecEmpleadoEntityPublic[],
    ) {}
}
