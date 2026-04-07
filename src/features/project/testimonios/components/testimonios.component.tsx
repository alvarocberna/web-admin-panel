'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faStar } from '@fortawesome/free-solid-svg-icons';
import { TestimoniosService, TestimoniosEntity, TestimonioEntity } from '@/features/project';
import { ContenedorSec } from '@/shared/project';
import { TestimonioForm } from './testimonio-form.component';

const VISIBLES = 3;
const INTERVALO_MS = 3500;

function TestimonioCarouselCard({ testimonio }: { testimonio: TestimonioEntity }) {
    const fecha = new Date(testimonio.fecha_creacion);
    return (
        <div className="card px-5 py-5 h-full flex flex-col hover-btn select-none">
            <p className="text-md font-semibold text-zinc-900 mb-1">
                {testimonio.nombre} {testimonio.apellido}
            </p>
            <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        style={{ width: '12px', height: '12px' }}
                        className={i < testimonio.calificacion ? 'text-yellow-400' : 'text-zinc-200'}
                    />
                ))}
            </div>
            <p className="text-sm text-zinc-700 flex-1 line-clamp-3">
                {testimonio.descripcion}
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100">
                <p className="text-xs text-zinc-500">{fecha.toLocaleDateString('es-ES')}</p>
            </div>
        </div>
    );
}

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
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-zinc-900">
                        {testimonios.titulo}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setModalAbierto(true)}
                            className="btn primary-btn text-sm"
                        >
                            Escribir testimonio
                        </button>
                    </div>
                </div>

                {testimonios.descripcion && (
                    <p className="text-md text-zinc-700 mb-4">{testimonios.descripcion}</p>
                )}

                {aprobados.length === 0 ? (
                    <div className="card py-14 text-center text-zinc-400 text-sm">
                        No hay testimonios registrados.
                    </div>
                ) : (
                    <div
                        className="grid gap-4 transition-opacity duration-400"
                        style={{
                            gridTemplateColumns: `repeat(${VISIBLES}, minmax(0, 1fr))`,
                            opacity: animando ? 0 : 1,
                        }}
                    >
                        {visibles.map(t => (
                            <TestimonioCarouselCard key={t.id} testimonio={t} />
                        ))}
                    </div>
                )}
                <div className='w-full'>
                    <button
                        onClick={() => router.push('/project/testimonios')}
                        className="btn secondary-btn text-sm"
                    >
                        Ver todos
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
