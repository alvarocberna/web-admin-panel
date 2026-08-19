'use client'
//NEXT
import Image from 'next/image';
import { useRouter } from 'next/navigation';
//REACT
import { useState, useRef, useEffect } from 'react';
//FEATURES
import { EmpleadoEntityPublic } from '@/features';
//COMPONENTS
import { EmpleadoModalPublic } from './empleado-modal.component';
//CONFIG
import { INTEGRATION_CONFIG, Comportamiento, EstiloDosVariantes as Estilo } from '@/features/integration/config';

interface EmpleadoCardProps {
    empleado: EmpleadoEntityPublic | null;
    comportamiento?: Comportamiento;
    estilo?: Estilo;
}

export function EmpleadoCardPublic({ empleado, comportamiento = INTEGRATION_CONFIG.empleado.comportamiento, estilo = INTEGRATION_CONFIG.empleado.estilo }: EmpleadoCardProps) {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [fullModalOpen, setFullModalOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    if(!empleado) return;

    useEffect(() => {
        if (!contentRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContentHeight(entry.contentRect.height);
            }
        });
        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, []);

    const needsCap = contentHeight >= 460;
    const showGradient = needsCap && !expanded;

    const onCardClick = comportamiento === 'modal'
        ? () => setFullModalOpen(true)
        : () => router.push(`/equipo/${empleado.slug}`);

    return (
        <>
            {estilo === 'estilo1' ? (
                /* ── Estilo 1: imagen de portada, texto centrado, expandible ── */
                <div className="w-full sm:w-1/2 lg:w-1/3 mb-10 flex px-0 ">
                    <div
                        className='w-full sm:w-[90%] lg:w-[90%] flex flex-col bg-superficie-oscura mx-auto h-full rounded-xl cursor-pointer'
                        style={{ borderRadius: '15px' }}
                        onClick={onCardClick}
                    >
                        <div
                            className="w-full flex flex-col relative flex-1 bg-superficie-oscura rounded-xl"
                            style={{
                                maxHeight: needsCap && !expanded ? '460px' : 'none',
                                overflow: needsCap && !expanded ? 'hidden' : 'visible',
                                alignItems: 'start'
                            }}
                        >
                            <div ref={contentRef} className='flex flex-col w-full rounded-xl' style={{ position: 'relative', top: '0' }}>
                                <div className='relative' style={{ width: '100%', height: '260px', top: '0px' }}>
                                    <Image src={empleado.imgUrl ?? ''} alt={empleado.imgAlt ?? 'image'} fill={true} style={{ objectFit: "cover", objectPosition: "top", borderRadius: '15px 15px 0px 0px' }} />
                                </div>
                                <div className='w-full flex flex-col py-3 px-8 bg-superficie-oscura rounded-xl'>
                                    <h2 className="w-full mb-1 text-center text-md font-semibold text-texto-invertido">
                                        {empleado.nombrePrimero}
                                        {empleado.nombreSegundo ? ` ${empleado.nombreSegundo}` : ''}{' '}
                                        {empleado.apellidoPaterno}
                                        {empleado.apellidoMaterno ? ` ${empleado.apellidoMaterno}` : ''}
                                    </h2>
                                    {empleado.profesion && (
                                        <p className='w-full text-center mb-1 text-sm font-semibold text-texto-invertido'>{empleado.profesion}</p>
                                    )}
                                    {empleado.especialidad && (
                                        <p className='w-full text-center mb-1 text-sm font-semibold text-texto-invertido'>{empleado.especialidad}</p>
                                    )}
                                    {empleado.descripcion && (
                                        <p className='w-full text-center mb-1 text-sm text-texto-invertido'>{empleado.descripcion}</p>
                                    )}
                                </div>
                            </div>
                            {showGradient &&
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: 'linear-gradient(to bottom, rgba(var(--pub-superficie-rgb),0), rgba(var(--pub-superficie-rgb),1))' }} />
                            }
                        </div>
                        {needsCap && comportamiento === 'navegar' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                className='btn primary-btn py-2 text-sm text-texto-invertido focus:outline-none focus-visible:ring-2 focus-visible:ring-gris-oscuro focus-visible:ring-offset-0'
                            >
                                {expanded ? 'Ver menos' : 'Ver más'}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* ── Estilo 2: avatar circular, texto alineado a la izquierda ── */
                <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                    <div
                        className="card px-5 py-5 h-full flex flex-col cursor-pointer"
                        onClick={onCardClick}
                    >
                        {empleado.imgUrl ? (
                            <img
                                src={empleado.imgUrl}
                                alt={empleado.imgAlt ?? 'image'}
                                className="w-20 h-20 rounded-full object-cover mb-3"
                            />
                        )
                        :
                        (
                            <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-texto-invertido text-md font-bold mb-2"
                            style={{ background: 'var(--color-lila)' }}
                            >
                                {empleado.nombrePrimero[0]}{empleado.apellidoPaterno[0]}
                            </div>
                        )
                        }
                        <p className="text-md font-semibold text-texto">
                            {empleado.nombrePrimero}
                            {empleado.nombreSegundo ? ` ${empleado.nombreSegundo}` : ''}{' '}
                            {empleado.apellidoPaterno}
                            {empleado.apellidoMaterno ? ` ${empleado.apellidoMaterno}` : ''}
                        </p>
                        {empleado.profesion && (
                            <p className="text-sm font-semibold text-texto">{empleado.profesion}</p>
                        )}
                        {empleado.especialidad && (
                            <p className="text-sm font-semibold text-texto">{empleado.especialidad}</p>
                        )}
                        {empleado.descripcion && (
                            <p className="text-sm text-gris-oscuro mt-2 line-clamp-3">{empleado.descripcion}</p>
                        )}
                    </div>
                </div>
            )}

            <EmpleadoModalPublic
                empleado={empleado}
                isOpen={fullModalOpen}
                onClose={() => setFullModalOpen(false)}
            />
        </>
    );
}
