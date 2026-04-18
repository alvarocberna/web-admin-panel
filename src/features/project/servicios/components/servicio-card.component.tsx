'use client'
//NEXT
import Image from "next/image"
import { useRouter } from "next/navigation"
//REACT
import { useState } from "react"
import { createPortal } from "react-dom"
//FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as solidIcons from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
//FEATURES
import { ServicioEntity } from "@/features/project"

interface IconColor {
    bg: string;
    icon: string;
}

// ALTERNAR COMPORTAMIENTO: 'navegar' | 'modal'
const COMPORTAMIENTO: 'navegar' | 'modal' = 'modal';

// ALTERNAR ESTILO: 1 (imagen con overlay) | 2 (card con imagen superior y texto) | 3 (card con icono superior izquierdo)
const ESTILO: 1 | 2 | 3 = 3;

export function ServicioCard({ iconColor, ...srv }: ServicioEntity & { iconColor?: IconColor }) {
    const router = useRouter();
    const [opacity, setOpacity] = useState<number>(70);
    const [fullModalOpen, setFullModalOpen] = useState(false);

    const iconDef = srv.icono
        ? Object.values(solidIcons).find(
              (v): v is IconDefinition =>
                  !!v && typeof v === 'object' && 'iconName' in v && (v as IconDefinition).iconName === srv.icono,
          )
        : undefined;

    const onCardClick = COMPORTAMIENTO === 'navegar'
        ? () => router.push(`/project/servicios/${srv.slug}`)
        : ESTILO === 1
            ? () => setFullModalOpen(true)
            : () => setFullModalOpen(true);

    return (
        <>
            {/* ── Estilo 1: imagen con overlay oscuro ───────────────────────────── */}
            {ESTILO === 1 && (
                <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div
                        className="px-0 mb-10 w-full cursor-pointer"
                        style={{ height: '250px', position: 'relative', borderRadius: '12px' }}
                        onClick={onCardClick}
                        onMouseEnter={() => setOpacity(50)}
                        onMouseLeave={() => setOpacity(70)}
                    >
                        <Image
                            src={srv.img_url ?? ''}
                            alt={srv.img_alt ?? '...'}
                            fill={true}
                            style={{ position: 'absolute', borderRadius: '12px' }}
                        />
                        <div
                            className="w-full h-full absolute transition-all duration-300 ease-in-out bg-black"
                            style={{ borderRadius: '12px', opacity: opacity / 100 }}
                        />
                        <div className="w-full h-full flex flex-col items-center justify-center" style={{ position: 'absolute' }}>
                            <p className="text-white text-xl text-center">
                                {srv.nombre_servicio}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Estilo 2: card con imagen superior y texto ────────────────────── */}
            {ESTILO === 2 && (
                <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div
                        className="card h-full flex flex-col hover-btn overflow-hidden cursor-pointer"
                        onClick={onCardClick}
                    >
                        {srv.img_url && (
                            <img
                                src={srv.img_url}
                                alt={srv.img_alt ?? 'image'}
                                style={{ borderRadius: '12px 12px 0px 0px' }}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="px-4 py-3">
                            <div className="flex items-start justify-between mb-2">
                                <p className="text-md font-semibold text-zinc-900">
                                    {srv.nombre_servicio}
                                </p>
                                {srv.destacado && (
                                    <span className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                        Destacado
                                    </span>
                                )}
                            </div>
                            {srv.valor && (
                                <p className="text-sm font-semibold text-zinc-900 mt-auto">{srv.valor}</p>
                            )}
                            {srv.nombre_promocion && (
                                <p className="text-sm font-semibold text-zinc-900">
                                    {srv.nombre_promocion}
                                    {srv.porcentaje_descuento ? ` — ${srv.porcentaje_descuento}% off` : ''}
                                </p>
                            )}
                            {srv.descripcion && (
                                <p className="text-sm text-zinc-700 line-clamp-3 mt-2 mb-3">{srv.descripcion}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Estilo 3: card con icono en esquina superior izquierda ──────── */}
            {ESTILO === 3 && (
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
                                {srv.nombre_servicio}
                            </p>
                            {srv.destacado && (
                                <span className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                    Destacado
                                </span>
                            )}
                        </div>
                        {srv.descripcion && (
                            <p className="text-sm text-zinc-500 line-clamp-3 mt-1 mb-3">{srv.descripcion}</p>
                        )}
                        {srv.valor && (
                            <p className="text-sm font-semibold text-zinc-900 mt-auto">{srv.valor}</p>
                        )}
                        {srv.nombre_promocion && (
                            <p className="text-sm text-zinc-700">
                                {srv.nombre_promocion}
                                {srv.porcentaje_descuento ? ` — ${srv.porcentaje_descuento}% off` : ''}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Modal completo ────────────────────────────────────────────────── */}
            {fullModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setFullModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Cabecera: info izquierda 60% + imagen derecha 40% */}
                        <div className="flex flex-row relative" style={{ minHeight: '220px' }}>
                            {/* Columna info */}
                            <div className="flex flex-col justify-center px-8 py-7 gap-1" style={{ width: srv.img_url ? '60%' : '100%' }}>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-xl font-bold text-zinc-900 leading-tight">
                                        {srv.nombre_servicio}
                                    </h2>
                                    {srv.destacado && (
                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                            Destacado
                                        </span>
                                    )}
                                </div>
                                {srv.valor && (
                                    <p className="text-md font-semibold text-zinc-900 mt-1">{srv.valor}</p>
                                )}
                                {srv.nombre_promocion && (
                                    <p className="text-md text-zinc-900">
                                        {srv.nombre_promocion}
                                        {srv.porcentaje_descuento ? ` — ${srv.porcentaje_descuento}% off` : ''}
                                    </p>
                                )}
                                {srv.descripcion && (
                                    <p className="text-sm text-zinc-700 mt-2">{srv.descripcion}</p>
                                )}
                            </div>

                            {/* Columna imagen */}
                            {srv.img_url && (
                                <div className="relative flex-shrink-0" style={{ width: '40%' }}>
                                    <Image
                                        src={srv.img_url}
                                        alt={srv.img_alt ?? 'image'}
                                        fill
                                        style={{ objectFit: 'cover', objectPosition: 'center', borderRadius: '0 16px 0 0' }}
                                    />
                                </div>
                            )}

                            {/* Botón cerrar */}
                            <button
                                onClick={() => setFullModalOpen(false)}
                                className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-zinc-700 font-bold text-lg shadow cursor-pointer z-10"
                            >
                                ×
                            </button>
                        </div>

                        {/* Secciones sec_servicio */}
                        {srv.sec_servicio?.length > 0 && (
                            <div className="px-8 pb-8 flex flex-col gap-6">
                                <hr className="border-zinc-200" />
                                {[...srv.sec_servicio]
                                    .sort((a, b) => a.nro_seccion - b.nro_seccion)
                                    .map((sec) => {
                                        const imagePosition = sec.image_position;
                                        const flex = imagePosition === 'left' ? 'flex flex-row-reverse' : 'flex';
                                        const textW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[60%]' : 'w-full';
                                        const imgW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[40%]' : 'w-full';
                                        const textHidden = imagePosition === 'all' ? 'hidden' : '';
                                        const imgHidden = (imagePosition === 'none' || !sec.image_url) ? 'hidden' : '';
                                        return (
                                            <div key={sec.id} className={`${flex} gap-4`}>
                                                <div className={`${textW} ${textHidden} flex flex-col gap-1`}>
                                                    {sec.titulo_sec && (
                                                        <h3 className="text-md font-semibold text-zinc-900">{sec.titulo_sec}</h3>
                                                    )}
                                                    {sec.contenido_sec && (
                                                        <p className="text-sm text-zinc-700">{sec.contenido_sec}</p>
                                                    )}
                                                </div>
                                                <div className={`${imgW} min-h-40 ${imgHidden} relative`}>
                                                    <Image
                                                        src={sec.image_url || ''}
                                                        alt={sec.image_alt || ''}
                                                        fill
                                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
