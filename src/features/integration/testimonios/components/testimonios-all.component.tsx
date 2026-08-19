'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faStar } from '@fortawesome/free-solid-svg-icons';
import { TestimoniosEntityPublic } from '@/features';
import { ContenedorSecPublic } from '@/shared';
import { TestimonioFormPublic } from '../../testimonios/components/testimonio-form.component';

interface Props {
    dataTestimonios: TestimoniosEntityPublic | null
}

export function TestimoniosAllPublic({dataTestimonios}: Props) {
    const [modalAbierto, setModalAbierto] = useState(false);


    const aprobados = (dataTestimonios?.testimonio ?? []).filter(t => t.status === 'approved');

    if (!dataTestimonios?.activo) return null;

    return (
        <div>
            <ContenedorSecPublic>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-texto">
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
                    <p className="text-md text-gris-oscuro mb-4">{dataTestimonios.descripcion}</p>
                )}

                {aprobados.length === 0 ? (
                    <div className="card py-14 text-center text-gris-suave text-sm">
                        No hay testimonios registrados.
                    </div>
                ) : (
                    <div className="flex flex-wrap -mx-2">
                        {aprobados.map(t => {
                            const fecha = new Date(t.fechaCreacion);
                            return (
                                <div key={t.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                                    <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                                        <p className="text-md font-semibold text-texto mb-1">
                                            {t.nombre} {t.apellido}
                                        </p>
                                        <div className="flex gap-0.5 mb-3">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={faStar}
                                                    style={{ width: '12px', height: '12px' }}
                                                    className={i < t.calificacion ? 'text-rating' : 'text-gris-claro'}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gris-oscuro flex-1">
                                            {t.descripcion}
                                        </p>
                                        <div className="mt-4 pt-3 border-t border-gris-claro">
                                            <p className="text-xs text-gris-suave">
                                                {fecha.toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ContenedorSecPublic>

            {modalAbierto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 px-4"
                    onClick={() => setModalAbierto(false)}
                >
                    <div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-superficie shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setModalAbierto(false)}
                            className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gris-mas-claro hover:bg-gris-claro transition-colors"
                            aria-label="Cerrar"
                        >
                            <FontAwesomeIcon icon={faXmark} style={{ width: '14px', height: '12px' }} className="text-gris" />
                        </button>
                        <TestimonioFormPublic sinContenedor />
                    </div>
                </div>
            )}
        </div>
    );
}
