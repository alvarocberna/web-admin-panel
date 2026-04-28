'use client'
//NEXT
import Image from "next/image";
//FEATURES
import { EmpleadoEntity, SecEmpleado } from "@/features/project";
//SHARED
import { ContenedorPage } from "@/shared/project";

interface EmpleadoPublicProps {
    dataEmpleado: EmpleadoEntity | null
}

export function EmpleadoPublic({dataEmpleado}: EmpleadoPublicProps) {

    if (!dataEmpleado) {
        return (
            <ContenedorPage>
                <p className="text-zinc-700">Empleado no encontrado.</p>
            </ContenedorPage>
        );
    }

    return (
        <ContenedorPage>
            <div className="text-black">
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
                    <p className="text-lg font-medium text-zinc-700 mb-1">{dataEmpleado.profesion}</p>
                )}
                {dataEmpleado.especialidad && (
                    <p className="text-md text-zinc-600 mb-4">{dataEmpleado.especialidad}</p>
                )}
                {dataEmpleado.descripcion && (
                    <p className="text-zinc-700 leading-relaxed mb-10">{dataEmpleado.descripcion}</p>
                )}

                {/* Secciones */}
                {dataEmpleado.sec_empleado?.length > 0 && (
                    <div>
                        {[...dataEmpleado.sec_empleado]
                            .sort((a, b) => a.nro_seccion - b.nro_seccion)
                            .map((sec) => (
                                <SecEmpleado key={sec.id} data={sec} />
                            ))}
                    </div>
                )}
            </div>
        </ContenedorPage>
    );
}
