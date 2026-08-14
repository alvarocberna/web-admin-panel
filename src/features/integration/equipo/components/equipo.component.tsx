'use client'
//REACT
import { useRef } from 'react';
//GSAP
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//FEATURES
import { EquipoEntityPublic, EmpleadoCardPublic } from '@/features';
//SHARED
import { ContenedorSecPublic } from '@/shared';
//CONFIG
import { INTEGRATION_CONFIG, Comportamiento, EstiloDosVariantes as Estilo } from '@/features/integration/config';

interface EquipoProps {
    equipo: EquipoEntityPublic | null;
    comportamiento?: Comportamiento;
    estilo?: Estilo;
}

gsap.registerPlugin(useGSAP,ScrollTrigger);


export function EquipoPublic({equipo, comportamiento = INTEGRATION_CONFIG.equipo.comportamiento, estilo = INTEGRATION_CONFIG.equipo.estilo}: EquipoProps) {

    const compRef = useRef(null);
    const dataEquipo = equipo;

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
        <div ref={compRef} id="equipo">
            {
                dataEquipo.activo ?
                <ContenedorSecPublic>
                    <div className="head-element text-center mb-12">
                        {/* <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-etiqueta-texto bg-etiqueta mb-4">
                            Tag
                        </span> */}
                        <h2 className="text-5xl text-texto-invertido font-mono mb-4">
                            {dataEquipo.titulo}
                        </h2>
                        <p className="text-texto-invertido text-md max-w-xl mx-auto">
                            {dataEquipo.descripcion}
                        </p>
                    </div>

                    {dataEquipo.empleado && dataEquipo.empleado.length > 0 ? (
                        <div className="body-element flex flex-wrap -mx-2">
                            {dataEquipo.empleado.filter(emp => emp.activo).map(emp => (
                                //CARD EMPLEADO
                                <EmpleadoCardPublic empleado={emp} comportamiento={comportamiento} estilo={estilo}/>
                            ))}
                        </div>
                    ) : (
                        <div className="card py-10 text-center text-gris-suave text-sm">
                            No hay miembros en el equipo.
                        </div>
                    )}
                </ContenedorSecPublic>
                :
                <div></div>
            }
        </div>
    );
}
