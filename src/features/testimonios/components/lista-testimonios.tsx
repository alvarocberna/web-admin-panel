'use client'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
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

    return (
        <div className="mt-8">
            <h3 className="text-sm font-semibold text-zinc-700 mb-4">Testimonios recibidos</h3>

            {testimonios.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay testimonios registrados.
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2">
                    {testimonios.map(t => {
                        const fecha = new Date(t.fecha_creacion);
                        return (
                            <div key={t.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                                <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900">{t.nombre} {t.apellido}</p>
                                            <p className="text-xs text-zinc-400">{t.correo}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.aprobado ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {t.aprobado ? 'Aprobado' : 'Pendiente'}
                                        </span>
                                    </div>

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

                                    <p className="text-xs text-zinc-600 flex-1 line-clamp-3">{t.descripcion}</p>

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
                    })}
                </div>
            )}

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
