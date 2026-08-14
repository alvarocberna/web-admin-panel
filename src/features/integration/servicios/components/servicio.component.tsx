'use client'
import Image from "next/image";
import { ServicioEntityPublic, SecServicioPublic } from "@/features";
import { ContenedorPagePublic } from "@/shared";

interface ServicioPublicProps {
    dataServicio: ServicioEntityPublic | null
}

export function ServicioPublic({dataServicio}: ServicioPublicProps) {

    if (!dataServicio) {
        return (
            <ContenedorPagePublic>
                <p className="text-gris-oscuro">Servicio no encontrado.</p>
            </ContenedorPagePublic>
        );
    }

    return (
        <ContenedorPagePublic>
            <div className="text-texto">
                {/* Cabecera */}
                {dataServicio.img_url && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
                        <Image
                            src={dataServicio.img_url}
                            alt={dataServicio.img_alt ?? 'image'}
                            fill={true}
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-semibold">{dataServicio.nombre_servicio}</h2>
                    {dataServicio.destacado && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-destacado text-destacado-texto">
                            Destacado
                        </span>
                    )}
                </div>
                {dataServicio.valor && (
                    <p className="text-xl font-medium text-texto mb-2">{dataServicio.valor}</p>
                )}
                {dataServicio.nombre_promocion && (
                    <p className="text-md text-gris mb-4">
                        {dataServicio.nombre_promocion}
                        {dataServicio.porcentaje_descuento ? ` — ${dataServicio.porcentaje_descuento}% off` : ''}
                    </p>
                )}
                {dataServicio.descripcion && (
                    <p className="text-gris-oscuro leading-relaxed mb-10">{dataServicio.descripcion}</p>
                )}

                {/* Secciones */}
                {dataServicio.sec_servicio?.length > 0 && (
                    <div>
                        {[...dataServicio.sec_servicio]
                            .sort((a, b) => a.nro_seccion - b.nro_seccion)
                            .map((sec) => (
                                <SecServicioPublic key={sec.id} data={sec} />
                            ))}
                    </div>
                )}
            </div>
        </ContenedorPagePublic>
    );
}
