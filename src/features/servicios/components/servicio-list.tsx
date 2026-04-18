'use client'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ServiciosService } from '../services/servicios.service';
import { ServicioEntity } from '../entities/servicio.entity';
import { ServicioForm } from './servicio-form';

interface Props {
    serviciosId: string;
    servicios: ServicioEntity[];
    onUpdated: (servicios: ServicioEntity[]) => void;
}

export function ServicioList({ serviciosId, servicios, onUpdated }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState<ServicioEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [servicioToDelete, setServicioToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreate = () => {
        setEditingServicio(null);
        setModalOpen(true);
    };

    const openEdit = (servicio: ServicioEntity) => {
        setEditingServicio(servicio);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingServicio(null);
    };

    const openDeleteModal = (id: string) => {
        setServicioToDelete(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setServicioToDelete(null);
        setDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!servicioToDelete) return;
        setIsDeleting(true);
        try {
            await ServiciosService.deleteServicio(servicioToDelete);
            onUpdated(servicios.filter(s => s.id !== servicioToDelete));
            toast.success('Servicio eliminado correctamente');
            closeDeleteModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el servicio');
            closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-zinc-900">Servicios ofrecidos</h3>
                <button type="button" onClick={openCreate} className="btn btn-primary h-8 text-xs px-3 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPlus} style={{ width: '11px', height: '11px' }} />
                    Nuevo servicio
                </button>
            </div>

            {servicios.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay servicios registrados.
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2">
                    {servicios.map(srv => (
                        <div key={srv.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                            <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">{srv.nombre_servicio}</p>
                                        {srv.valor && (
                                            <p className="text-xs text-zinc-500 truncate">{srv.valor}</p>
                                        )}
                                        {srv.destacado && (
                                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 mt-1 inline-block">
                                                Destacado
                                            </span>
                                        )}
                                    </div>
                                    <span className={`ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${srv.activo === true ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {srv.activo === true ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                {srv.descripcion && (
                                    <p className="text-xs text-zinc-600 flex-1 line-clamp-2 mb-3">{srv.descripcion}</p>
                                )}

                                {srv.orden && (
                                    <p className="text-xs text-zinc-400 mb-2">Orden: {srv.orden}</p>
                                )}

                                <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-zinc-100">
                                    <button
                                        onClick={() => openEdit(srv)}
                                        className="btn btn-outline h-8 text-xs px-3"
                                        title="Editar servicio"
                                    >
                                        <FontAwesomeIcon icon={faPencil} style={{ width: '11px', height: '11px' }} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(srv.id)}
                                        className="btn btn-ghost-destructive h-8 text-xs px-3"
                                        title="Eliminar servicio"
                                    >
                                        <FontAwesomeIcon icon={faTrash} style={{ width: '11px', height: '11px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <ServicioForm
                    editingServicio={editingServicio}
                    servicios={servicios}
                    onUpdated={onUpdated}
                    onClose={closeModal}
                />
            )}

            {/* Modal confirmación eliminar */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeDeleteModal} />
                    <div className="relative card p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar servicio</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este servicio?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeDeleteModal} className="btn btn-outline">Cancelar</button>
                            <button onClick={confirmDelete} disabled={isDeleting} className={`btn btn-destructive transition-opacity ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
