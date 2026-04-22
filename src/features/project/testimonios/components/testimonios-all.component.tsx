'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faStar } from '@fortawesome/free-solid-svg-icons';
import { TestimoniosService, TestimoniosEntity } from '@/features/project';
import { ContenedorSec } from '@/shared/project';
import { TestimonioForm } from '@/features/project/testimonios/components/testimonio-form.component';

interface Props {
    dataTestimonios: TestimoniosEntity | null
}

export function TestimoniosAllPublic({dataTestimonios}: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);


    const aprobados = (dataTestimonios?.testimonio ?? []).filter(t => t.status === 'approved');

    if (!dataTestimonios?.activo) return null;

    return (
        <div>
            <ContenedorSec>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-zinc-900">
                        {dataTestimonios.titulo}
                    </h3>
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="btn primary-btn text-sm"
                    >
                        Escribir testimonio
                    </button>
                </div>

                {dataTestimonios.descripcion && (
                    <p className="text-md text-zinc-700 mb-4">{dataTestimonios.descripcion}</p>
                )}

                {aprobados.length === 0 ? (
                    <div className="card py-14 text-center text-zinc-400 text-sm">
                        No hay testimonios registrados.
                    </div>
                ) : (
                    <div className="flex flex-wrap -mx-2">
                        {aprobados.map(t => {
                            const fecha = new Date(t.fecha_creacion);
                            return (
                                <div key={t.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                                    <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                                        <p className="text-md font-semibold text-zinc-900 mb-1">
                                            {t.nombre} {t.apellido}
                                        </p>
                                        <div className="flex gap-0.5 mb-3">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={faStar}
                                                    style={{ width: '12px', height: '12px' }}
                                                    className={i < t.calificacion ? 'text-yellow-400' : 'text-zinc-200'}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-zinc-700 flex-1">
                                            {t.descripcion}
                                        </p>
                                        <div className="mt-4 pt-3 border-t border-zinc-100">
                                            <p className="text-xs text-zinc-500">
                                                {fecha.toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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
                            <FontAwesomeIcon icon={faXmark} style={{ width: '14px', height: '12px' }} className="text-zinc-600" />
                        </button>
                        <TestimonioForm sinContenedor />
                    </div>
                </div>
            )}
        </div>
    );
}
