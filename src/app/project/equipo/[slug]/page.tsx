'use client'
//NEXT
import { useParams } from "next/navigation";
import Image from "next/image";
//REACT
import { useState, useEffect } from "react";
//FEATURES
import { EquipoService, EmpleadoEntity, SecEmpleado } from "@/features/project";
//SHARED
import { ContenedorPage } from "@/shared/project";

export default function VerEmpleado() {
    const slug = useParams<{ slug: string }>().slug;
    const [empleado, setEmpleado] = useState<EmpleadoEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmpleado = async () => {
            try {
                const data = await EquipoService.getEmpleadoBySlug(slug);
                setEmpleado(data);
            } catch (error) {
                console.log("error: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmpleado();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[90vh] flex justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!empleado) {
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
                {empleado.img_url && (
                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6">
                        <Image
                            src={empleado.img_url}
                            alt={empleado.img_alt ?? 'image'}
                            fill={true}
                            unoptimized
                            className="object-cover object-top"
                        />
                    </div>
                )}
                <h2 className="text-3xl font-semibold mb-1">
                    {empleado.nombre_primero}
                    {empleado.nombre_segundo ? ` ${empleado.nombre_segundo}` : ''}{' '}
                    {empleado.apellido_paterno}
                    {empleado.apellido_materno ? ` ${empleado.apellido_materno}` : ''}
                </h2>
                {empleado.profesion && (
                    <p className="text-lg font-medium text-zinc-700 mb-1">{empleado.profesion}</p>
                )}
                {empleado.especialidad && (
                    <p className="text-md text-zinc-600 mb-4">{empleado.especialidad}</p>
                )}
                {empleado.descripcion && (
                    <p className="text-zinc-700 leading-relaxed mb-10">{empleado.descripcion}</p>
                )}

                {/* Secciones */}
                {empleado.sec_empleado?.length > 0 && (
                    <div>
                        {[...empleado.sec_empleado]
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
