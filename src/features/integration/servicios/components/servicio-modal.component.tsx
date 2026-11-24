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
            className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/50"
            onClick={onClose}
        >
            <div
                className="bg-superficie rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera: info izquierda 60% + imagen derecha 40% */}
                <div className="flex flex-col sm:flex-row relative md:min-h-55" style={{ minHeight: '220px' }}>
                    {/* Columna info */}
                    <div className="flex flex-col justify-center px-8 py-7 gap-1 w-full sm:w-[60%]">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-texto leading-tight">
                                {servicio.nombreServicio}
                            </h2>
                            {servicio.destacado && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-destacado text-destacado-texto">
                                    Destacado
                                </span>
                            )}
                        </div>
                        {servicio.imgUrl && (
                            <div className="relative sm:hidden w-40 h-40 mx-auto mt-3 mb-3 rounded-full">
                                <Image
                                    src={servicio.imgUrl}
                                    alt={servicio.imgAlt ?? 'image'}
                                    className='rounded-full'
                                    fill
                                    style={{ objectFit: 'cover'}}
                                />
                            </div>
                        )}
                        {servicio.valor && (
                            <p className="text-md font-semibold text-texto mt-1">{servicio.valor}</p>
                        )}
                        {servicio.nombrePromocion && (
                            <p className="text-md text-texto">
                                {servicio.nombrePromocion}
                                {servicio.porcentajeDescuento ? ` — ${servicio.porcentajeDescuento}% off` : ''}
                            </p>
                        )}
                        {servicio.descripcion && (
                            <p className="text-sm text-gris-oscuro mt-2">{servicio.descripcion}</p>
                        )}
                    </div>

                    {/* Imagen - solo desktop */}
                    {servicio.imgUrl && (
                        <div className="relative shrink-0 overflow-hidden hidden sm:block w-[40%] rounded-tr-2xl">
                            <Image
                                src={servicio.imgUrl}
                                alt={servicio.imgAlt ?? 'image'}
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'top' }}
                            />
                        </div>
                    )}

                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 bg-superficie/80 hover:bg-superficie rounded-full w-8 h-8 flex items-center justify-center text-gris-oscuro font-bold text-lg shadow cursor-pointer z-10"
                    >
                        ×
                    </button>
                </div>

                {/* Secciones secServicio */}
                {servicio.secServicio?.length > 0 && (
                    <div className="px-8 pb-8 flex flex-col gap-6">
                        <hr className="border-gris-claro" />
                        {[...servicio.secServicio]
                            .sort((a, b) => a.nroSeccion - b.nroSeccion)
                            .map((sec) => {
                                const imagePosition = sec.imagePosition;
                                const flex = imagePosition === 'left' ? 'flex flex-row-reverse' : 'flex';
                                const flexDirection = imagePosition === 'all' ? 'flex-col' : 'flex-row';
                                const textW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[60%]' : 'w-full';
                                const imgW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[40%]' : 'w-full';
                                const imgHidden = (imagePosition === 'none' || !sec.imageUrl) ? 'hidden' : '';
                                return (
                                    <div key={sec.id} className={`${flex} ${flexDirection} gap-4`}>
                                        <div className={`w-full sm:${textW}  flex flex-col gap-1`}>
                                            {sec.tituloSec && (
                                                <h3 className="text-md font-semibold text-texto">{sec.tituloSec}</h3>
                                            )}
                                            {sec.imageUrl && (
                                                <div className={`w-full min-h-40 ${imgHidden} relative sm:hidden`}>
                                                    <Image
                                                        src={sec.imageUrl || ''}
                                                        alt={sec.imageAlt || ''}
                                                        fill
                                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                    />
                                                </div>
                                            )}
                                            {sec.contenidoSec && (
                                                <p className="text-sm text-gris-oscuro">{sec.contenidoSec}</p>
                                            )}
                                        </div>
                                        {sec.imageUrl && (
                                            <div className={`${imgW} min-h-40 ${imgHidden} relative hidden sm:block`}>
                                                <Image
                                                    src={sec.imageUrl || ''}
                                                    alt={sec.imageAlt || ''}
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
