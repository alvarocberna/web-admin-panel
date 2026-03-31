'use client'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TestimonioService, TestimoniosService } from '@/features';
import { TestimonioEntity } from '../entities/testimonio.entity';

export function ListaTestimonios() {
    const [testimonios, setTestimonios] = useState<TestimonioEntity[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [testimonioToDelete, setTestimonioToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchTestimonios = async () => {
            try {
                const res = await TestimoniosService.getTestimonios();
                const data = res?.testimonio;
                console.log('getTestimonios response:', res);
                setTestimonios(data ?? []);
            } catch (error) {
                console.error('Error obteniendo testimonios:', error);
            }
        };
        fetchTestimonios();
    }, []);

    const pending = testimonios.filter(t => t.status === 'pending');
    const approved = testimonios.filter(t => t.status === 'approved');

    const openModal = (id: string) => { setTestimonioToDelete(id); setModalOpen(true); };
    const closeModal = () => { setTestimonioToDelete(null); setModalOpen(false); };

    const confirmDelete = async () => {
        if (!testimonioToDelete) return;
        try {
            await TestimonioService.deleteTestimonio(testimonioToDelete);
            setTestimonios(prev => prev.filter(t => t.id !== testimonioToDelete));
            toast.success('Testimonio eliminado correctamente');
            closeModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el testimonio');
            closeModal();
        }
    };

    const handleAprobar = async (id: string) => {
        try {
            await TestimonioService.approveTestimonio(id);
            setTestimonios(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } as TestimonioEntity : t));
            toast.success('Testimonio aprobado');
        } catch (error: any) {
            toast.error(error?.message || 'Error al aprobar el testimonio');
        }
    };

    const renderCard = (t: TestimonioEntity, showAcciones: boolean) => {
        const fecha = new Date(t.fecha_creacion);
        return (
            <div key={t.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-sm font-semibold text-zinc-900">{t.nombre} {t.apellido}</p>
                            <p className="text-xs text-zinc-400">{t.correo}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            t.status === 'approved' ? 'bg-green-100 text-green-700'
                            : t.status === 'rejected' ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {t.status === 'approved' ? 'Aprobado' : t.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                        </span>
                    </div>

                    <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <FontAwesomeIcon
                                key={i}
                                icon={faStar}
                                style={{ width: '12px', height: '12px' }}
                                className={i < t.calificacion! ? 'text-yellow-400' : 'text-zinc-200'}
                            />
                        ))}
                    </div>

                    <p className="text-xs text-zinc-600 flex-1 line-clamp-3">{t.descripcion}</p>

                    {showAcciones && (
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleAprobar(t.id)}
                                className="btn btn-primary flex-1 h-9 text-xs flex items-center justify-center gap-1.5"
                                title="Aceptar testimonio"
                            >
                                <FontAwesomeIcon icon={faCheck} style={{ width: '12px', height: '12px' }} />
                                Aceptar
                            </button>
                            <button
                                onClick={() => openModal(t.id)}
                                className="btn btn-destructive flex-1 h-9 text-xs flex items-center justify-center gap-1.5"
                                title="Rechazar testimonio"
                            >
                                <FontAwesomeIcon icon={faXmark} style={{ width: '12px', height: '12px' }} />
                                Rechazar
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                        <p className="text-xs text-zinc-400">
                            {fecha.toLocaleDateString('es-ES')}
                        </p>
                        <button
                            onClick={() => openModal(t.id)}
                            className="btn btn-ghost-destructive h-8 text-xs px-3"
                            title="Eliminar testimonio"
                        >
                            <FontAwesomeIcon icon={faTrash} style={{ width: '12px', height: '12px' }} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-8">
            <h3 className="text-md font-semibold text-zinc-900 mb-6">Testimonios recibidos</h3>

            {/* Pendientes */}
            <div className="mb-8">
                <h4 className="text-sm font-medium text-zinc-500 mb-3">Pendientes de aprobación</h4>
                {pending.length === 0 ? (
                    <div className="card py-10 text-center text-zinc-400 text-sm">
                        No hay testimonios pendientes.
                    </div>
                ) : (
                    <div className="flex flex-wrap -mx-2">
                        {pending.map(t => renderCard(t, true))}
                    </div>
                )}
            </div>

            {/* Aprobados */}
            <div>
                <h4 className="text-sm font-medium text-zinc-500 mb-3">Aprobados</h4>
                {approved.length === 0 ? (
                    <div className="card py-10 text-center text-zinc-400 text-sm">
                        No hay testimonios aprobados.
                    </div>
                ) : (
                    <div className="flex flex-wrap -mx-2">
                        {approved.map(t => renderCard(t, false))}
                    </div>
                )}
            </div>

            {/* Modal de confirmación */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                        onClick={closeModal}
                    />
                    <div className="relative card p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar testimonio</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este testimonio?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="btn btn-outline">Cancelar</button>
                            <button onClick={confirmDelete} className="btn btn-destructive">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
