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
                {dataEmpleado.img_url && (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6">
                        <Image
                            src={dataEmpleado.img_url}
                            alt={dataEmpleado.img_alt ?? 'image'}
                            fill={true}
                            unoptimized
                            className="object-cover object-top"
                        />
                    </div>
                )}
                <h2 className="text-3xl font-semibold mb-1">
                    {dataEmpleado.nombre_primero}
                    {dataEmpleado.nombre_segundo ? ` ${dataEmpleado.nombre_segundo}` : ''}{' '}
                    {dataEmpleado.apellido_paterno}
                    {dataEmpleado.apellido_materno ? ` ${dataEmpleado.apellido_materno}` : ''}
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
                {dataEmpleado.sec_empleado?.length > 0 && (
                    <div>
                        {[...dataEmpleado.sec_empleado]
                            .sort((a, b) => a.nro_seccion - b.nro_seccion)
                            .map((sec) => (
                                <SecEmpleadoPublic key={sec.id} data={sec} />
                            ))}
                    </div>
                )}
            </div>
        </ContenedorPagePublic>
    );
}
