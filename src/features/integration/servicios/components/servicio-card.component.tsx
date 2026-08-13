'use client'
//NEXT
import Image from "next/image"
import { useRouter } from "next/navigation"
//REACT
import { useState } from "react"
//FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as solidIcons from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
//FEATURES
import { ServicioEntityPublic } from "@/features"
//COMPONENTS
import { ServicioModalPublic } from "./servicio-modal.component"
//CONFIG
import { INTEGRATION_CONFIG, Comportamiento, EstiloTresVariantes as Estilo } from "@/features/integration/config"


interface IconColor {
    bg: string;
    icon: string;
}

interface ServicioCardProps {
    servicio: ServicioEntityPublic | null;
    comportamiento?: Comportamiento;
    estilo?: Estilo;
    iconColor: IconColor;
}


export function ServicioCardPublic({ servicio, comportamiento = INTEGRATION_CONFIG.servicio.comportamiento, estilo = INTEGRATION_CONFIG.servicio.estilo, iconColor }: ServicioCardProps) {
    const router = useRouter();
    const [opacity, setOpacity] = useState<number>(70);
    const [fullModalOpen, setFullModalOpen] = useState(false);

    if(!servicio) return;

    const iconDef = servicio.icono
        ? Object.values(solidIcons).find(
              (v): v is IconDefinition =>
                  !!v && typeof v === 'object' && 'iconName' in v && (v as IconDefinition).iconName === servicio.icono,
          )
        : undefined;

    const onCardClick = comportamiento === 'navegar'
        ? () => router.push(`/servicios/${servicio.slug}`)
        : estilo === 'estilo1'
            ? () => setFullModalOpen(true)
            : () => setFullModalOpen(true);

    return (
        <>
            {/* ── Estilo 1: imagen con overlay oscuro ───────────────────────────── */}
            {estilo === 'estilo1' && (
                <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div
                        className="px-0 mb-10 w-full cursor-pointer"
                        style={{ height: '250px', position: 'relative', borderRadius: '12px' }}
                        onClick={onCardClick}
                        onMouseEnter={() => setOpacity(50)}
                        onMouseLeave={() => setOpacity(70)}
                    >
                        <Image
                            src={servicio.img_url ?? ''}
                            alt={servicio.img_alt ?? '...'}
                            fill={true}
                            style={{ position: 'absolute', borderRadius: '12px' }}
                        />
                        <div
                            className="w-full h-full absolute transition-all duration-300 ease-in-out bg-black"
                            style={{ borderRadius: '12px', opacity: opacity / 100 }}
                        />
                        <div className="w-full h-full flex flex-col items-center justify-center" style={{ position: 'absolute' }}>
                            <p className="text-white text-xl text-center">
                                {servicio.nombre_servicio}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Estilo 2: card con imagen superior y texto ────────────────────── */}
            {estilo === 'estilo2' && (
                <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div
                        className="card h-full flex flex-col hover-btn overflow-hidden cursor-pointer"
                        onClick={onCardClick}
                    >
                        {servicio.img_url && (
                            <img
                                src={servicio.img_url}
                                alt={servicio.img_alt ?? 'image'}
                                style={{ borderRadius: '12px 12px 0px 0px' }}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="px-4 py-3">
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-md font-semibold text-zinc-900">
                                    {servicio.nombre_servicio}
                                </p>
                                {servicio.destacado && (
                                    <span className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                        Destacado
                                    </span>
                                )}
                            </div>
                            {servicio.valor && (
                                <p className="text-sm font-semibold text-zinc-900 mt-auto">{servicio.valor}</p>
                            )}
                            {servicio.nombre_promocion && (
                                <p className="text-sm font-semibold text-zinc-900">
                                    {servicio.nombre_promocion}
                                    {servicio.porcentaje_descuento ? ` — ${servicio.porcentaje_descuento}% off` : ''}
                                </p>
                            )}
                            {servicio.descripcion && (
                                <p className="text-sm text-zinc-700 line-clamp-3 mt-2 mb-3">{servicio.descripcion}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Estilo 3: card con icono en esquina superior izquierda ──────── */}
            {estilo === 'estilo3' && (
                <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div
                        className="card h-full flex flex-col hover-btn cursor-pointer p-5"
                        onClick={onCardClick}
                    >
                        {iconDef && (
                            <div
                                className="mb-4 w-14 h-14 flex items-center justify-center rounded-2xl"
                                style={{
                                    backgroundColor: iconColor?.bg ?? '#F4F4F5',
                                    color: iconColor?.icon ?? '#3F3F46',
                                }}
                            >
                                <FontAwesomeIcon icon={iconDef} style={{ width: '22px', height: '22px' }} />
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-1">
                            <p className="text-md font-semibold text-zinc-900">
                                {servicio.nombre_servicio}
                            </p>
                            {servicio.destacado && (
                                <span className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                    Destacado
                                </span>
                            )}
                        </div>
                        {servicio.descripcion && (
                            <p className="text-sm text-zinc-500 line-clamp-3 mt-1 mb-3">{servicio.descripcion}</p>
                        )}
                        {servicio.valor && (
                            <p className="text-sm font-semibold text-zinc-900 mt-auto">{servicio.valor}</p>
                        )}
                        {servicio.nombre_promocion && (
                            <p className="text-sm text-zinc-700">
                                {servicio.nombre_promocion}
                                {servicio.porcentaje_descuento ? ` — ${servicio.porcentaje_descuento}% off` : ''}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <ServicioModalPublic
                servicio={servicio}
                isOpen={fullModalOpen}
                onClose={() => setFullModalOpen(false)}
            />
        </>
    );
}
