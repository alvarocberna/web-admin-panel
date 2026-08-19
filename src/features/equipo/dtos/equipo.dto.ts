
//EQUIPO - ENTIDAD PADRE
export abstract class CreateEquipoDto {
    abstract titulo: string;
    abstract descripcion: string | null;
    abstract activo: boolean;
    abstract notificacion: boolean;
    abstract habilitado: boolean;
}

export abstract class UpdateEquipoDto {
    abstract titulo?: string;
    abstract descripcion?: string;
    abstract activo?: boolean;
    abstract notificacion?: boolean;
    abstract habilitado?: boolean;
}

//EMPLEADO - ENTIDAD HIJA
export abstract class CreateEmpleadoDto {
    abstract nombrePrimero: string;
    abstract nombreSegundo: string | null;
    abstract apellidoPaterno: string;
    abstract apellidoMaterno: string | null;
    abstract profesion: string | null;
    abstract especialidad: string | null;
    abstract descripcion: string | null;
    abstract orden: string | null;
    abstract activo: boolean;
    abstract slug: string;
    abstract imgUrl: string | null;
    abstract imgAlt: string | null;
}

export abstract class UpdateEmpleadoDto {
    abstract id: string;
    abstract nombrePrimero?: string;
    abstract nombreSegundo?: string;
    abstract apellidoPaterno?: string;
    abstract apellidoMaterno?: string;
    abstract profesion?: string;
    abstract especialidad?: string;
    abstract descripcion?: string;
    abstract orden?: string;
    abstract activo?: boolean;
    abstract slug?: string;
    abstract imgUrl?: string;
    abstract imgAlt?: string;
}

//SEC-EMPLEADO - ENTIDAD NIETA JAJ
export abstract class CreateSecEmpleadoDto{
        abstract nroSeccion: number;
        abstract tituloSec: string | null;
        abstract contenidoSec: string | null;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
}

export abstract class UpdateSecEmpleadoDto{
        abstract id: string;
        abstract nroSeccion: number;
        abstract tituloSec: string | null;
        abstract contenidoSec: string | null;
        abstract imageUrl: string | null;
        abstract imageAlt: string | null;
        abstract imagePosition: string | null;
}
