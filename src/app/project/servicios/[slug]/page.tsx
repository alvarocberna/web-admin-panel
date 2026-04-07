'use client'
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ServiciosService, ServicioEntity, SecServicio } from "@/features/project";
import { ContenedorPage } from "@/shared/project";

export default function VerServicio() {
    const slug = useParams<{ slug: string }>().slug;
    const [servicio, setServicio] = useState<ServicioEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const data = await ServiciosService.getServicioBySlug(slug);
                setServicio(data);
            } catch (error) {
                console.log("error: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchServicio();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[90vh] flex justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!servicio) {
        return (
            <ContenedorPage>
                <p className="text-zinc-700">Servicio no encontrado.</p>
            </ContenedorPage>
        );
    }

    return (
        <ContenedorPage>
            <div className="text-black">
                {/* Cabecera */}
                {servicio.img_url && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
                        <Image
                            src={servicio.img_url}
                            alt={servicio.img_alt ?? 'image'}
                            fill={true}
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-semibold">{servicio.nombre_servicio}</h2>
                    {servicio.destacado && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                            Destacado
                        </span>
                    )}
                </div>
                {servicio.valor && (
                    <p className="text-xl font-medium text-zinc-800 mb-2">{servicio.valor}</p>
                )}
                {servicio.nombre_promocion && (
                    <p className="text-md text-zinc-600 mb-4">
                        {servicio.nombre_promocion}
                        {servicio.porcentaje_descuento ? ` — ${servicio.porcentaje_descuento}% off` : ''}
                    </p>
                )}
                {servicio.descripcion && (
                    <p className="text-zinc-700 leading-relaxed mb-10">{servicio.descripcion}</p>
                )}

                {/* Secciones */}
                {servicio.sec_servicio?.length > 0 && (
                    <div>
                        {[...servicio.sec_servicio]
                            .sort((a, b) => a.nro_seccion - b.nro_seccion)
                            .map((sec) => (
                                <SecServicio key={sec.id} data={sec} />
                            ))}
                    </div>
                )}
            </div>
        </ContenedorPage>
    );
}
