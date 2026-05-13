'use client'
//NEXT
import Image from 'next/image';
import { useRouter } from 'next/navigation';
//REACT
import { useState, useRef, useEffect } from 'react';
//FEATURES
import { EmpleadoEntity } from '@/features/project';
//COMPONENTS
import { EmpleadoModal } from './empleado-modal.component';


type Comportamiento = 'navegar' | 'modal';
type Estilo = 'estilo1' | 'estilo2';

interface EmpleadoCardProps {
    empleado: EmpleadoEntity | null;
    comportamiento?: Comportamiento;
    estilo?: Estilo;
}

export function EmpleadoCard({ empleado, comportamiento = 'modal', estilo = 'estilo1' }: EmpleadoCardProps) {
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
                        className='w-full sm:w-[90%] lg:w-[90%] flex flex-col bg-zinc-900 mx-auto h-full rounded-xl cursor-pointer'
                        style={{ borderRadius: '15px' }}
                        onClick={onCardClick}
                    >
                        <div
                            className="w-full flex flex-col relative flex-1 bg-zinc-900 rounded-xl"
                            style={{
                                maxHeight: needsCap && !expanded ? '460px' : 'none',
                                overflow: needsCap && !expanded ? 'hidden' : 'visible',
                                alignItems: 'start'
                            }}
                        >
                            <div ref={contentRef} className='flex flex-col w-full rounded-xl' style={{ position: 'relative', top: '0' }}>
                                <div className='relative' style={{ width: '100%', height: '260px', top: '0px' }}>
                                    <Image src={empleado.img_url ?? ''} alt={empleado.img_alt ?? 'image'} fill={true} style={{ objectFit: "cover", objectPosition: "top", borderRadius: '15px 15px 0px 0px' }} />
                                </div>
                                <div className='w-full flex flex-col py-3 px-8 bg-zinc-900 rounded-xl'>
                                    <h2 className="w-full mb-1 text-center text-md font-semibold text-white">
                                        {empleado.nombre_primero}
                                        {empleado.nombre_segundo ? ` ${empleado.nombre_segundo}` : ''}{' '}
                                        {empleado.apellido_paterno}
                                        {empleado.apellido_materno ? ` ${empleado.apellido_materno}` : ''}
                                    </h2>
                                    {empleado.profesion && (
                                        <p className='w-full text-center mb-1 text-sm font-semibold text-white'>{empleado.profesion}</p>
                                    )}
                                    {empleado.especialidad && (
                                        <p className='w-full text-center mb-1 text-sm font-semibold text-white'>{empleado.especialidad}</p>
                                    )}
                                    {empleado.descripcion && (
                                        <p className='w-full text-center mb-1 text-sm text-white'>{empleado.descripcion}</p>
                                    )}
                                </div>
                            </div>
                            {showGradient &&
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))' }} />
                            }
                        </div>
                        {needsCap && comportamiento === 'navegar' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                className='btn primary-btn py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-0'
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
                        {empleado.img_url ? (
                            <img
                                src={empleado.img_url}
                                alt={empleado.img_alt ?? 'image'}
                                className="w-20 h-20 rounded-full object-cover mb-3"
                            />
                        )
                        :
                        (
                            <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-md font-bold mb-2"
                            style={{ background: '#7c6fbf' }}
                            >
                                {empleado.nombre_primero[0]}{empleado.apellido_paterno[0]}
                            </div>
                        )
                        }
                        <p className="text-md font-semibold text-zinc-900">
                            {empleado.nombre_primero}
                            {empleado.nombre_segundo ? ` ${empleado.nombre_segundo}` : ''}{' '}
                            {empleado.apellido_paterno}
                            {empleado.apellido_materno ? ` ${empleado.apellido_materno}` : ''}
                        </p>
                        {empleado.profesion && (
                            <p className="text-sm font-semibold text-zinc-900">{empleado.profesion}</p>
                        )}
                        {empleado.especialidad && (
                            <p className="text-sm font-semibold text-zinc-900">{empleado.especialidad}</p>
                        )}
                        {empleado.descripcion && (
                            <p className="text-sm text-zinc-700 mt-2 line-clamp-3">{empleado.descripcion}</p>
                        )}
                    </div>
                </div>
            )}

            <EmpleadoModal
                empleado={empleado}
                isOpen={fullModalOpen}
                onClose={() => setFullModalOpen(false)}
            />
        </>
    );
}
