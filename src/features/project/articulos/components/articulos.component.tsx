'use client'
//REACT
import { useState, useEffect, useRef } from 'react';
//NEXT
import Link from 'next/link';
//GSAP
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//FEATURES
import { ArticulosService, ArticuloEntity, ArticulosEntity } from '@/features/project';
//SHARED
import { ContenedorSec, ContenedorPage } from '@/shared/project';
//COMPONENTS
import { ArticuloCard } from './articulo-card.component';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(useGSAP,ScrollTrigger);

const MAX_ARTICULOS = 9;
const POR_PAGINA = 3;

/* ─── Hook compartido ─────────────────────────────────────────────────────── */
function useArticulos() {
    const [articulos, setArticulos] = useState<ArticulosEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ArticulosService.getArticulos()
            .then(data => setArticulos(data))
            .catch(err => console.log('error: ' + err))
            .finally(() => setLoading(false));
    }, []);

    return { articulos, loading };
}

interface ArticulosPublicProps {
    dataArticulos: ArticulosEntity | null
}


/* ─── ArticulosPublic (homepage — carrusel, máx 9) ───────────────────────── */
export function ArticulosPublic({ dataArticulos }: ArticulosPublicProps) {
    const [pagina, setPagina] = useState(0);
    const [tick, setTick]     = useState(0); // reinicia el intervalo al navegar

    const articulosFiltrados = (dataArticulos?.articulo ?? [])
        .filter(art => art.status === 'approved' && art.activo === true)
        .slice(0, MAX_ARTICULOS);

    const totalPaginas = Math.ceil(articulosFiltrados.length / POR_PAGINA);

    // Auto-avance; se reinicia cuando el usuario navega manualmente (tick cambia)
    useEffect(() => {
        if (totalPaginas <= 1) return;
        const id = setInterval(() => setPagina(p => (p + 1) % totalPaginas), 5000);
        return () => clearInterval(id);
    }, [totalPaginas, tick]);

    const irA = (nueva: number) => {
        setPagina(nueva);
        setTick(t => t + 1);
    };

    const articulosPagina = articulosFiltrados.slice(
        pagina * POR_PAGINA,
        pagina * POR_PAGINA + POR_PAGINA
    );

    const compRef = useRef(null);
    
    useGSAP(() => {
        if(!dataArticulos) return;

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
    }, { scope: compRef, dependencies: [dataArticulos] })

    if (!dataArticulos) return null;

    return (
        <div ref={compRef}>
            {dataArticulos.activo && (
                <ContenedorSec id='articulos'>
                    <div className='w-full flex flex-col'>

                        {/* Encabezado */}
                        <div className="head-element mb-12 flex flex-col justify-start">
                            <span className="inline-block self-start px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 text-sky-900 bg-sky-100">
                                Blog
                            </span>
                            <h2 className="text-4xl font-extrabold text-texto mb-4">
                                {dataArticulos.titulo}
                            </h2>
                            <p className="text-gris text-lg max-w-xl">
                                {dataArticulos.descripcion}
                            </p>
                        </div>

                        {/* Carrusel */}
                        <div className="body-element relative cards-element">
                            {/* Botón anterior */}
                            {totalPaginas > 1 && (
                                <button
                                    onClick={() => irA((pagina - 1 + totalPaginas) % totalPaginas)}
                                    className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gris-claro shadow-sm hover:bg-fondo transition-colors"
                                    aria-label="Anterior"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="text-gris-oscuro text-sm" />
                                </button>
                            )}

                            {/* Tarjetas */}
                            <div className='w-full flex flex-wrap -mx-2'>
                                {articulosPagina.map((art: ArticuloEntity, index: number) => (
                                    <ArticuloCard key={index} articulo={art} />
                                ))}
                            </div>

                            {/* Botón siguiente */}
                            {totalPaginas > 1 && (
                                <button
                                    onClick={() => irA((pagina + 1) % totalPaginas)}
                                    className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gris-claro shadow-sm hover:bg-fondo transition-colors"
                                    aria-label="Siguiente"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} className="text-gris-oscuro text-sm" />
                                </button>
                            )}
                        </div>

                        {/* Dots */}
                        {totalPaginas > 1 && (
                            <div className="body-element flex justify-center gap-2 mt-6">
                                {Array.from({ length: totalPaginas }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => irA(i)}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            i === pagina ? 'w-6 bg-lila' : 'w-2 bg-gris-claro'
                                        }`}
                                        aria-label={`Página ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Ver todos */}
                        <div className="body-element flex justify-center mt-10">
                            <Link
                                href="/articulos"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-lila text-lila text-sm font-semibold hover:bg-lila hover:text-white transition-colors duration-200"
                            >
                                Ver todos los artículos
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </div>
                    </div>
                </ContenedorSec>
            )}
        </div>
    );
}

/* ─── ArticulosTodosPublic (página /articulos — todos) ───────────────────── */
export function ArticulosAllPublic() {
    const { articulos, loading } = useArticulos();

    const articulosFiltrados = (articulos?.articulo ?? [])
        .filter(art => art.status === 'approved' && art.activo === true);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!articulos) return null;

    return (
        <ContenedorPage>
            <div className='w-full flex flex-col'>

                {/* Encabezado */}
                <div className="mb-12 flex flex-col justify-start">
                    <span className="inline-block self-start px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-lila bg-lila-claro/20 mb-4">
                        Blog
                    </span>
                    <h2 className="text-4xl font-extrabold text-texto mb-4">
                        {articulos.titulo}
                    </h2>
                    {articulos.descripcion && (
                        <p className="text-gris text-lg max-w-xl">
                            {articulos.descripcion}
                        </p>
                    )}
                </div>

                {/* Grid de todos los artículos */}
                {articulosFiltrados.length === 0 ? (
                    <p className="text-gris text-center py-16">No hay artículos publicados.</p>
                ) : (
                    <div className='w-full flex flex-wrap -mx-2 pb-10'>
                        {articulosFiltrados.map((art: ArticuloEntity, index: number) => (
                            <ArticuloCard key={index} articulo={art} />
                        ))}
                    </div>
                )}
            </div>
        </ContenedorPage>
    );
}
