'use client'
//REACT
import { useState, useEffect, useRef } from 'react';
//NEXT
import { useRouter } from 'next/navigation';
//GSAP
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
//FEATURES
import { TestimoniosEntityPublic, TestimonioCardPublic } from '@/features';
import { TestimonioFormPublic } from './testimonio-form.component';
//SHARED
import { ContenedorSecPublic } from '@/shared';

const VISIBLES = 3;
const INTERVALO_MS = 5000;

interface Props {
    dataTestimonios: TestimoniosEntityPublic | null
}

gsap.registerPlugin(useGSAP,ScrollTrigger);


export function TestimoniosPublic({dataTestimonios}: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [indice, setIndice] = useState(0);
    const [animando, setAnimando] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const router = useRouter();

    const compRef = useRef(null);

    const aprobados = (dataTestimonios?.testimonio ?? [])
        .filter(t => t.status === 'approved')
        .slice(-10);

    useEffect(() => {
        if (aprobados.length <= VISIBLES) return;
        intervalRef.current = setInterval(() => {
            setAnimando(true);
            setTimeout(() => {
                setIndice(prev => (prev + 1) % aprobados.length);
                setAnimando(false);
            }, 400);
        }, INTERVALO_MS);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [aprobados.length]);

    const visibles = aprobados.length > 0
        ? Array.from({ length: Math.min(VISIBLES, aprobados.length) }, (_, i) =>
            aprobados[(indice + i) % aprobados.length]
          )
        : [];

    useGSAP(() => {
        if(!dataTestimonios) return;

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
    }, { scope: compRef, dependencies: [dataTestimonios] })

    if(!dataTestimonios) return null;

    return (
        <div ref={compRef}>
            <ContenedorSecPublic>
                <div className="head-element text-center mb-12">
                    <h2 className="title-element text-4xl font-extrabold text-texto mb-4">
                        {dataTestimonios.titulo}
                    </h2>
                    <p className="description-element text-gris text-lg max-w-xl mx-auto">
                        {dataTestimonios.descripcion}
                    </p>
                </div>

                {aprobados.length === 0 ? (
                    <div className="card py-14 text-center text-zinc-400 text-sm">
                        No hay testimonios registrados.
                    </div>
                ) : (
                    <div
                        className="body-element grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-400"
                        style={{ opacity: animando ? 0 : 1 }}
                    >
                        {visibles.map(t => (
                            <TestimonioCardPublic key={t.id} testimonio={t} />
                        ))}
                    </div>
                )}
                <div className='body-element w-full flex justify-between'>
                    <button
                        onClick={() => router.push('/testimonios')}
                        className="btn secondary-btn text-sm"
                    >
                        Ver todos
                    </button>
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="btn primary-btn text-sm"
                    >
                        Escribir testimonio
                    </button>
                </div>
            </ContenedorSecPublic>

            {modalAbierto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setModalAbierto(false)}
                >
                    <div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setModalAbierto(false)}
                            className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
                            aria-label="Cerrar"
                        >
                            <FontAwesomeIcon icon={faXmark} style={{ width: '14px', height: '14px' }} className="text-zinc-600" />
                        </button>
                        <TestimonioFormPublic sinContenedor />
                    </div>
                </div>
            )}
        </div>
    );
}
