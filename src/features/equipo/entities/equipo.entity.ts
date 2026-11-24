import { EmpleadoEntity } from './empleado.entity';

export class EquipoEntity {
    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string | null,
        public activo: boolean,
        public notificacion: boolean,
        public habilitado: boolean,
        public proyectoId: string,
        public empleado: EmpleadoEntity[],
    ) {}
}
