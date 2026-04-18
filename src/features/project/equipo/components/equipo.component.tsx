'use client'
//REACT
import { useRef } from 'react';
//GSAP
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//FEATURES
import { EquipoEntity, EmpleadoCard } from '@/features/project';
//SHARED
import { ContenedorSec } from '@/shared/project';

interface Props {
    dataEquipo: EquipoEntity | null
}

gsap.registerPlugin(useGSAP,ScrollTrigger);

export function EquipoPublic({dataEquipo}: Props) {

    const compRef = useRef(null);

    useGSAP(() => {
        if(!dataEquipo) return;

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
    }, { scope: compRef, dependencies: [dataEquipo] })

    if(!dataEquipo) return null;

    return (
        <div ref={compRef}>
            {
                dataEquipo.activo ?
                <ContenedorSec>
                    <div className="head-element text-center mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-sky-800 bg-sky-100 mb-4">
                            Tag
                        </span>
                        <h2 className="text-4xl font-extrabold text-texto mb-4">
                            {dataEquipo.titulo}
                        </h2>
                        <p className="text-gris text-lg max-w-xl mx-auto">
                            {dataEquipo.descripcion}
                        </p>
                    </div>

                    {dataEquipo.empleado && dataEquipo.empleado.length > 0 ? (
                        <div className="body-element flex flex-wrap -mx-2">
                            {dataEquipo.empleado.filter(emp => emp.activo).map(emp => (
                                //CARD EMPLEADO
                                <EmpleadoCard {...emp} />
                            ))}
                        </div>
                    ) : (
                        <div className="card py-10 text-center text-zinc-400 text-sm">
                            No hay miembros en el equipo.
                        </div>
                    )}
                </ContenedorSec>
                :
                <div></div>
            }
        </div>
    );
}
