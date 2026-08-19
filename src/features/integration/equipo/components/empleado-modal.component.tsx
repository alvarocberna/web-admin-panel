'use client'
//NEXT
import Image from 'next/image';
//REACT
import { createPortal } from 'react-dom';
//FEATURES
import { EmpleadoEntityPublic } from '@/features';

interface EmpleadoModalProps {
    empleado: EmpleadoEntityPublic;
    isOpen: boolean;
    onClose: () => void;
}

export function EmpleadoModalPublic({ empleado, isOpen, onClose }: EmpleadoModalProps) {
    if (!isOpen) return null;

    const nombreCompleto = [
        empleado.nombrePrimero,
        empleado.nombreSegundo,
        empleado.apellidoPaterno,
        empleado.apellidoMaterno,
    ].filter(Boolean).join(' ');

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
                <div className="flex flex-col sm:flex-row relative md:min-h-55">
                    {/* Columna info */}
                    <div className="flex flex-col justify-center px-8 py-7 gap-1 w-full sm:w-[60%]">
                        <h2 className="text-xl font-bold text-texto leading-tight">
                            {nombreCompleto}
                        </h2>
                        {empleado.profesion && (
                            <p className="text-sm font-semibold text-texto mt-1">{empleado.profesion}</p>
                        )}
                        {/* Imagen circular — solo mobile */}
                        {empleado.imgUrl && (
                            <div className="relative sm:hidden w-40 h-40 mx-auto mt-3 mb-3 rounded-full">
                                <Image
                                    src={empleado.imgUrl}
                                    alt={empleado.imgAlt ?? 'image'}
                                    className='rounded-full'
                                    fill
                                    style={{ objectFit: 'cover'}}
                                />
                            </div>
                        )}
                        {empleado.especialidad && (
                            <p className="text-sm font-semibold text-texto">{empleado.especialidad}</p>
                        )}
                        {empleado.descripcion && (
                            <p className="text-sm text-gris-oscuro mt-2">{empleado.descripcion}</p>
                        )}
                    </div>

                    {/* Imagen - solo desktop */}
                    {empleado.imgUrl && (
                        <div className="relative shrink-0 overflow-hidden hidden sm:block w-[40%] rounded-tr-2xl">
                            <Image
                                src={empleado.imgUrl}
                                alt={empleado.imgAlt ?? 'image'}
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
                {empleado.secEmpleado?.length > 0 && (
                    <div className="px-8 pb-8 flex flex-col gap-6">
                        <hr className="border-gris-claro" />
                        {[...empleado.secEmpleado]
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
