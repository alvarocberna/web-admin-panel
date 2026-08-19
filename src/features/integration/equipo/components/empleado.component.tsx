'use client'
//NEXT
import Image from "next/image";
//FEATURES
import { EmpleadoEntityPublic, SecEmpleadoPublic } from "@/features";
//SHARED
import { ContenedorPagePublic } from "@/shared";

interface EmpleadoPublicProps {
    dataEmpleado: EmpleadoEntityPublic | null
}

export function EmpleadoPublic({dataEmpleado}: EmpleadoPublicProps) {

    if (!dataEmpleado) {
        return (
            <ContenedorPagePublic>
                <p className="text-gris-oscuro">Empleado no encontrado.</p>
            </ContenedorPagePublic>
        );
    }

    return (
        <ContenedorPagePublic>
            <div className="text-texto">
                {/* Cabecera */}
                {dataEmpleado.imgUrl && (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6">
                        <Image
                            src={dataEmpleado.imgUrl}
                            alt={dataEmpleado.imgAlt ?? 'image'}
                            fill={true}
                            unoptimized
                            className="object-cover object-top"
                        />
                    </div>
                )}
                <h2 className="text-3xl font-semibold mb-1">
                    {dataEmpleado.nombrePrimero}
                    {dataEmpleado.nombreSegundo ? ` ${dataEmpleado.nombreSegundo}` : ''}{' '}
                    {dataEmpleado.apellidoPaterno}
                    {dataEmpleado.apellidoMaterno ? ` ${dataEmpleado.apellidoMaterno}` : ''}
                </h2>
                {dataEmpleado.profesion && (
                    <p className="text-lg font-medium text-gris-oscuro mb-1">{dataEmpleado.profesion}</p>
                )}
                {dataEmpleado.especialidad && (
                    <p className="text-md text-gris mb-4">{dataEmpleado.especialidad}</p>
                )}
                {dataEmpleado.descripcion && (
                    <p className="text-gris-oscuro leading-relaxed mb-10">{dataEmpleado.descripcion}</p>
                )}

                {/* Secciones */}
                {dataEmpleado.secEmpleado?.length > 0 && (
                    <div>
                        {[...dataEmpleado.secEmpleado]
                            .sort((a, b) => a.nroSeccion - b.nroSeccion)
                            .map((sec) => (
                                <SecEmpleadoPublic key={sec.id} data={sec} />
                            ))}
                    </div>
                )}
            </div>
        </ContenedorPagePublic>
    );
}
