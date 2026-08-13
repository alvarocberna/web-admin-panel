'use client'
//REACT
import { useRef } from 'react';
//GSAP
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//FEATURES
import { ServiciosEntityPublic, ServicioCardPublic } from '@/features';
//SHARED
import { ContenedorSecPublic } from '@/shared';
//CONFIG
import { INTEGRATION_CONFIG, Comportamiento, EstiloTresVariantes as Estilo } from '@/features/integration/config';


const ICON_COLORS: { bg: string; icon: string }[] = [
    { bg: '#c0ddef', icon: '#4a90b8' }, // violeta
    { bg: '#faf0c0', icon: '#decc78' }, // rosa
    { bg: '#fce4ec', icon: '#d47090' }, // azul
    { bg: '#c8e6d4', icon: '#4f9a72' }, // verde
    { bg: '#e8dff5', icon: '#c0a8dc' }, // ámbar
    { bg: '#c8e6d4', icon: '#4f9a72' }, // verde
];

interface ServiciosProps {
    servicios: ServiciosEntityPublic | null;
    comportamiento?: Comportamiento;
    estilo?: Estilo;
}

gsap.registerPlugin(useGSAP,ScrollTrigger);


export function ServiciosPublic({servicios, comportamiento = INTEGRATION_CONFIG.servicios.comportamiento, estilo = INTEGRATION_CONFIG.servicios.estilo}: ServiciosProps) {

    const compRef = useRef(null);

    useGSAP(() => {
        if(!servicios) return;

        const gsapTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: compRef.current,
                start: 'top 65%',
                end: 'bottom top',
                markers: false,
            }
        });
        gsapTimeline.from(['.head-element', '.body-element'], {
            y: 50,
            opacity: 0,
            ease: "power2.inOut",
            duration: 1,
            stagger: 0.3
        })
    }, { scope: compRef, dependencies: [servicios] })

    if (!servicios) return null;

    return (
        <div ref={compRef} id="servicios">
            {
                servicios.activo &&
                <ContenedorSecPublic>
                    <div className="head-element text-center mb-12">
                        <h2 className="title-element font-mono text-5xl text-white mb-4">
                            {servicios.titulo}
                        </h2>
                        <p className="description-element text-white text-md max-w-xl mx-auto">
                            {servicios.descripcion}
                        </p>
                    </div>
                    {servicios.servicio && servicios.servicio.length > 0 ? (
                        <div className="body-element flex flex-wrap -mx-2">
                            {servicios.servicio.filter(srv => srv.activo).map((srv, i) => (
                               <ServicioCardPublic
                                    key={srv.slug}
                                    servicio={srv} 
                                    comportamiento={comportamiento} 
                                    estilo={estilo} 
                                    iconColor={ICON_COLORS[i % ICON_COLORS.length]}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="card py-10 text-center text-zinc-400 text-sm">
                            No hay servicios disponibles.
                        </div>
                    )}
                </ContenedorSecPublic>
        }
        </div>
    );
}
