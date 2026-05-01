'use client'
//NEXT
import Image from 'next/image';
import { useRouter } from 'next/navigation';
//REACT
import { useState, useRef, useEffect } from 'react';
//FEATURES
import { EmpleadoEntity, EmpleadoModal } from '@/features/project';

// ALTERNAR COMPORTAMIENTO: 'navegar' | 'modal'
const COMPORTAMIENTO: 'navegar' | 'modal' = 'modal';

// ALTERNAR ESTILO: 'estilo1' | 'estilo2'
const ESTILO: 'estilo1' | 'estilo2' = 'estilo1';

export function EmpleadoCard(props: EmpleadoEntity){
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [fullModalOpen, setFullModalOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

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

    const onCardClick = COMPORTAMIENTO === 'modal'
        ? () => setFullModalOpen(true)
        : () => router.push(`/equipo/${props.slug}`);

    return (
        <>
            {ESTILO === 'estilo1' ? (
                /* ── Estilo 1: imagen de portada, texto centrado, expandible ── */
                <div className="w-full sm:w-1/2 lg:w-1/3 mb-10 flex px-0">
                    <div
                        className='card w-full sm:w-[90%] lg:w-[90%] flex flex-col mx-auto h-full cursor-pointer'
                        style={{ borderRadius: '15px' }}
                        onClick={onCardClick}
                    >
                        <div
                            className="w-full flex flex-col relative flex-1"
                            style={{
                                maxHeight: needsCap && !expanded ? '460px' : 'none',
                                overflow: needsCap && !expanded ? 'hidden' : 'visible',
                                alignItems: 'start'
                            }}
                        >
                            <div ref={contentRef} className='flex flex-col w-full' style={{ position: 'relative', top: '0' }}>
                                <div className='relative' style={{ width: '100%', height: '260px', top: '0px' }}>
                                    <Image src={props.img_url ?? ''} alt={props.img_alt ?? 'image'} fill={true} style={{ objectFit: "cover", objectPosition: "top", borderRadius: '15px 15px 0px 0px' }} />
                                </div>
                                <div className='w-full flex flex-col py-3 px-8'>
                                    <h2 className="w-full mb-1 text-center text-md font-semibold text-zinc-900">
                                        {props.nombre_primero}
                                        {props.nombre_segundo ? ` ${props.nombre_segundo}` : ''}{' '}
                                        {props.apellido_paterno}
                                        {props.apellido_materno ? ` ${props.apellido_materno}` : ''}
                                    </h2>
                                    {props.profesion && (
                                        <p className='w-full text-center mb-1 text-sm font-semibold text-zinc-900'>{props.profesion}</p>
                                    )}
                                    {props.especialidad && (
                                        <p className='w-full text-center mb-1 text-sm font-semibold text-zinc-900'>{props.especialidad}</p>
                                    )}
                                    {props.descripcion && (
                                        <p className='w-full text-center mb-1 text-sm text-zinc-700'>{props.descripcion}</p>
                                    )}
                                </div>
                            </div>
                            {showGradient &&
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))' }} />
                            }
                        </div>
                        {needsCap && COMPORTAMIENTO === 'navegar' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                className='btn primary-btn py-2 text-sm text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-0'
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
                        {props.img_url ? (
                            <img
                                src={props.img_url}
                                alt={props.img_alt ?? 'image'}
                                className="w-20 h-20 rounded-full object-cover mb-3"
                            />
                        )
                        :
                        (
                            <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-md font-bold mb-2"
                            style={{ background: '#7c6fbf' }}
                            >
                                {props.nombre_primero[0]}{props.apellido_paterno[0]}
                            </div>
                        )
                        }
                        <p className="text-md font-semibold text-zinc-900">
                            {props.nombre_primero}
                            {props.nombre_segundo ? ` ${props.nombre_segundo}` : ''}{' '}
                            {props.apellido_paterno}
                            {props.apellido_materno ? ` ${props.apellido_materno}` : ''}
                        </p>
                        {props.profesion && (
                            <p className="text-sm font-semibold text-zinc-900">{props.profesion}</p>
                        )}
                        {props.especialidad && (
                            <p className="text-sm font-semibold text-zinc-900">{props.especialidad}</p>
                        )}
                        {props.descripcion && (
                            <p className="text-sm text-zinc-700 mt-2 line-clamp-3">{props.descripcion}</p>
                        )}
                    </div>
                </div>
            )}

            <EmpleadoModal
                empleado={props}
                isOpen={fullModalOpen}
                onClose={() => setFullModalOpen(false)}
            />
        </>
    );
}
