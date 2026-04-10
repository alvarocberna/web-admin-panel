'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faStar } from '@fortawesome/free-solid-svg-icons';
import { TestimoniosService, TestimoniosEntity, TestimonioEntity, TestimonioCard } from '@/features/project';
import { ContenedorSec } from '@/shared/project';
import { TestimonioForm } from './testimonio-form.component';

const VISIBLES = 3;
const INTERVALO_MS = 5000;


export function TestimoniosPublic() {
    const [testimonios, setTestimonios] = useState<TestimoniosEntity>();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [indice, setIndice] = useState(0);
    const [animando, setAnimando] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTestimonios = async () => {
            try {
                const data = await TestimoniosService.getTestimonios();
                if (!data) return;
                setTestimonios(data);
            } catch (error) {
                console.error('Error obteniendo testimonios:', error);
            }
        };
        fetchTestimonios();
    }, []);

    const aprobados = (testimonios?.testimonio ?? [])
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

    if (!testimonios?.activo) return null;

    return (
        <div>
            <ContenedorSec>
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-texto mb-4">
                        {testimonios.titulo}
                    </h2>
                    <p className="text-gris text-lg max-w-xl mx-auto">
                        {testimonios.descripcion}
                    </p>
                </div>

                {aprobados.length === 0 ? (
                    <div className="card py-14 text-center text-zinc-400 text-sm">
                        No hay testimonios registrados.
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-400"
                        style={{ opacity: animando ? 0 : 1 }}
                    >
                        {visibles.map(t => (
                            <TestimonioCard key={t.id} testimonio={t} />
                        ))}
                    </div>
                )}
                <div className='w-full flex justify-between'>
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
            </ContenedorSec>

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
                        <TestimonioForm sinContenedor />
                    </div>
                </div>
            )}
        </div>
    );
}
