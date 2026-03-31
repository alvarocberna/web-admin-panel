'use client'
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { EmpleadoEntity } from '@/features/project';

export function Card2Empleado(props: EmpleadoEntity){
    const [expanded, setExpanded] = useState(false);
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
    const showButton = needsCap;

    return(
        // Container
        <div className="w-full sm:w-1/2 lg:w-1/3 mb-10 flex px-0">
           {/* contenedor principal */}
            <div className='card w-full sm:w-[90%] lg:w-[90%] flex flex-col mx-auto h-full' style={{borderRadius: '15px'}}>
                {/* contenedor secundario */}
                <div
                    className="w-full flex flex-col relative flex-1"
                    style={{
                        maxHeight: needsCap && !expanded ? '460px' : 'none',
                        overflow: needsCap && !expanded ? 'hidden' : 'visible',
                        alignItems: 'start'
                    }}
                >
                    {/* contenido */}
                    <div ref={contentRef} className='flex flex-col w-full' style={{position: 'relative', top: '0'}}>
                        {/* Imagen */}
                        <div className='relative' style={{width: '100%', height: '260px', top: '0px'}}>
                            <Image src={props.img_url} alt={props.img_alt} fill={true} style={{ objectFit: "cover", objectPosition: "top", borderRadius: '15px 15px 0px 0px'}}/>
                        </div>
                        {/* Texto */}
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
                    {/* degradado */}
                    {showGradient &&
                        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))'}}/>
                    }
                </div>
                {/* btn */}
                {showButton && (
                    <button onClick={() => setExpanded(!expanded)} className='btn primary-btn py-2 text-sm text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-0'>
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </button>
                )}
            </div>
        </div>
    )
}
