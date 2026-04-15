'use client'
//REACT
import { useRef } from 'react';
//GSAP
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//FEATURES
import { ServiciosEntity, ServicioCard } from '@/features/project';
//SHARED
import { ContenedorSec } from '@/shared/project';

interface Props {
    dataServicios: ServiciosEntity | null
}

gsap.registerPlugin(useGSAP,ScrollTrigger);

export function ServiciosPublic({dataServicios}: Props) {

    const compRef = useRef(null);

    useGSAP(() => {
        if(!dataServicios) return;

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
    }, { scope: compRef, dependencies: [dataServicios] })

    if (!dataServicios) return null;

    return (
        <div ref={compRef}>
            {
                dataServicios.activo &&
                <ContenedorSec>
                    <div className="head-element text-center mb-12">
                        <h2 className="title-element text-4xl font-extrabold text-texto mb-4">
                            {dataServicios.titulo}
                        </h2>
                        <p className="description-element text-gris text-lg max-w-xl mx-auto">
                            {dataServicios.descripcion}
                        </p>
                    </div>
                    {dataServicios.servicio && dataServicios.servicio.length > 0 ? (
                        <div className="body-element flex flex-wrap -mx-2">
                            {dataServicios.servicio.filter(srv => srv.activo).map(srv => (
                               <ServicioCard {...srv}/>
                            ))}
                        </div>
                    ) : (
                        <div className="card py-10 text-center text-zinc-400 text-sm">
                            No hay servicios disponibles.
                        </div>
                    )}
                </ContenedorSec>
        }
        </div>
    );
}
