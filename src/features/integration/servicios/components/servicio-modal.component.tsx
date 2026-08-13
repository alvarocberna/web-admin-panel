'use client'
//NEXT
import Image from "next/image"
//REACT
import { createPortal } from "react-dom"
//FEATURES
import { ServicioEntityPublic } from "@/features"

interface ServicioModalProps {
    servicio: ServicioEntityPublic;
    isOpen: boolean;
    onClose: () => void;
}

export function ServicioModalPublic({ servicio, isOpen, onClose }: ServicioModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera: info izquierda 60% + imagen derecha 40% */}
                <div className="flex flex-col sm:flex-row relative md:min-h-55" style={{ minHeight: '220px' }}>
                    {/* Columna info */}
                    <div className="flex flex-col justify-center px-8 py-7 gap-1 w-full sm:w-[60%]">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-zinc-900 leading-tight">
                                {servicio.nombre_servicio}
                            </h2>
                            {servicio.destacado && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                    Destacado
                                </span>
                            )}
                        </div>
                        {servicio.img_url && (
                            <div className="relative sm:hidden w-40 h-40 mx-auto mt-3 mb-3 rounded-full">
                                <Image
                                    src={servicio.img_url}
                                    alt={servicio.img_alt ?? 'image'}
                                    className='rounded-full'
                                    fill
                                    style={{ objectFit: 'cover'}}
                                />
                            </div>
                        )}
                        {servicio.valor && (
                            <p className="text-md font-semibold text-zinc-900 mt-1">{servicio.valor}</p>
                        )}
                        {servicio.nombre_promocion && (
                            <p className="text-md text-zinc-900">
                                {servicio.nombre_promocion}
                                {servicio.porcentaje_descuento ? ` — ${servicio.porcentaje_descuento}% off` : ''}
                            </p>
                        )}
                        {servicio.descripcion && (
                            <p className="text-sm text-zinc-700 mt-2">{servicio.descripcion}</p>
                        )}
                    </div>

                    {/* Imagen - solo desktop */}
                    {servicio.img_url && (
                        <div className="relative shrink-0 overflow-hidden hidden sm:block w-[40%] rounded-tr-2xl">
                            <Image
                                src={servicio.img_url}
                                alt={servicio.img_alt ?? 'image'}
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'top' }}
                            />
                        </div>
                    )}

                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-zinc-700 font-bold text-lg shadow cursor-pointer z-10"
                    >
                        ×
                    </button>
                </div>

                {/* Secciones sec_servicio */}
                {servicio.sec_servicio?.length > 0 && (
                    <div className="px-8 pb-8 flex flex-col gap-6">
                        <hr className="border-zinc-200" />
                        {[...servicio.sec_servicio]
                            .sort((a, b) => a.nro_seccion - b.nro_seccion)
                            .map((sec) => {
                                const imagePosition = sec.image_position;
                                const flex = imagePosition === 'left' ? 'flex flex-row-reverse' : 'flex';
                                const flexDirection = imagePosition === 'all' ? 'flex-col' : 'flex-row';
                                const textW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[60%]' : 'w-full';
                                const imgW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[40%]' : 'w-full';
                                const imgHidden = (imagePosition === 'none' || !sec.image_url) ? 'hidden' : '';
                                return (
                                    <div key={sec.id} className={`${flex} ${flexDirection} gap-4`}>
                                        <div className={`w-full sm:${textW}  flex flex-col gap-1`}>
                                            {sec.titulo_sec && (
                                                <h3 className="text-md font-semibold text-zinc-900">{sec.titulo_sec}</h3>
                                            )}
                                            {sec.image_url && (
                                                <div className={`w-full min-h-40 ${imgHidden} relative sm:hidden`}>
                                                    <Image
                                                        src={sec.image_url || ''}
                                                        alt={sec.image_alt || ''}
                                                        fill
                                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                    />
                                                </div>
                                            )}
                                            {sec.contenido_sec && (
                                                <p className="text-sm text-zinc-700">{sec.contenido_sec}</p>
                                            )}
                                        </div>
                                        {sec.image_url && (
                                            <div className={`${imgW} min-h-40 ${imgHidden} relative hidden sm:block`}>
                                                <Image
                                                    src={sec.image_url || ''}
                                                    alt={sec.image_alt || ''}
                                                    fill
                                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
