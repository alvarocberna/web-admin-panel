'use client'
//NEXT
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//REACT
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faTrash, faPlus, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
//FEATURES
import { ArticulosService } from '../services/articulos.service';
import { ArticuloEntity } from '../entities/articulo.entity';

interface Props {
    articulos: ArticuloEntity[];
    rol?: string;
}

export function ArticuloList({ articulos, rol }: Props) {
    const router = useRouter();
    const [items, setItems] = useState<ArticuloEntity[]>(articulos);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [approvingId, setApprovingId] = useState<string | null>(null);

    useEffect(() => {
        setItems(articulos);
    }, [articulos]);

    const pending = items.filter(a => a.status === 'pending');
    const approved = items.filter(a => a.status === 'approved');

    const openDeleteModal = (id: string) => {
        setArticleToDelete(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setArticleToDelete(null);
        setDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!articleToDelete) return;
        setIsDeleting(true);
        try {
            await ArticulosService.deleteArticulo(articleToDelete);
            setItems(curr => curr.filter(a => a.id !== articleToDelete));
            toast.success('Artículo eliminado correctamente');
            closeDeleteModal();
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el artículo');
            closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAprobar = async (id: string) => {
        setApprovingId(id);
        try {
            await ArticulosService.approveArticulo(id);
            setItems(curr => curr.map(a => a.id === id ? { ...a, status: 'approved' } as ArticuloEntity : a));
            toast.success('Artículo aprobado');
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || 'Error al aprobar el artículo');
        } finally {
            setApprovingId(null);
        }
    };

    const renderCard = (articulo: ArticuloEntity, showAcciones: boolean) => {
        const fecha = new Date(articulo.fecha_publicacion);
        const anno = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        return (
            <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4" key={articulo.id}>
                <div className="card flex flex-col px-5 py-5 h-full hover-btn">
                    <h4 className="mb-1.5 font-semibold text-zinc-900 text-base leading-snug line-clamp-2">
                        {articulo.titulo}
                    </h4>
                    <p className="mb-1 text-sm text-zinc-500">Por: {articulo.autor}</p>
                    <p className="mb-1 text-xs text-zinc-400">{dia}/{mes}/{anno}</p>
                    {articulo.activo !== true && (
                        <p className="mb-4 text-xs text-orange-700">Inactivo</p>
                    )}

                    {showAcciones && (
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => handleAprobar(articulo.id)}
                                disabled={approvingId === articulo.id}
                                className={`btn btn-primary flex-1 h-9 text-xs flex items-center justify-center gap-1.5 transition-opacity ${approvingId === articulo.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Aceptar artículo"
                            >
                                <FontAwesomeIcon icon={faCheck} style={{ width: '12px', height: '12px' }} />
                                {approvingId === articulo.id ? 'Procesando...' : 'Aceptar'}
                            </button>
                            <button
                                onClick={() => openDeleteModal(articulo.id)}
                                className="btn btn-destructive flex-1 h-9 text-xs flex items-center justify-center gap-1.5"
                                title="Rechazar artículo"
                            >
                                <FontAwesomeIcon icon={faXmark} style={{ width: '12px', height: '12px' }} />
                                Rechazar
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                        <Link
                            href={`/articulos/${articulo.id}/ver`}
                            className="btn btn-ghost flex-1 h-9 text-xs"
                            title="Ver artículo"
                        >
                            <FontAwesomeIcon icon={faEye} style={{ width: '14px', height: '14px' }} />
                        </Link>
                        <Link
                            href={`/articulos/${articulo.id}/modificar`}
                            className="btn btn-ghost flex-1 h-9 text-xs"
                            title="Editar artículo"
                        >
                            <FontAwesomeIcon icon={faPencil} style={{ width: '14px', height: '14px' }} />
                        </Link>
                        <button
                            onClick={() => openDeleteModal(articulo.id)}
                            className="btn btn-ghost-destructive flex-1 h-9 text-xs"
                            title="Eliminar artículo"
                        >
                            <FontAwesomeIcon icon={faTrash} style={{ width: '14px', height: '14px' }} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-md font-semibold text-zinc-900">Artículos</h3>
                <Link href="/articulos/crear">
                    <button type="button" className="btn btn-primary h-8 text-xs px-3 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faPlus} style={{ width: '11px', height: '11px' }} />
                        Nuevo artículo
                    </button>
                </Link>
            </div>

            {(rol === 'ADMIN' || rol === 'SUPERADMIN') && (
                <div className="mb-8">
                    <h4 className="text-sm font-medium text-zinc-500 mb-3">Pendientes de aprobación</h4>
                    {pending.length === 0 ? (
                        <div className="card py-10 text-center text-zinc-400 text-sm">
                            No hay artículos pendientes.
                        </div>
                    ) : (
                        <div className="flex flex-wrap -mx-2">
                            {pending.map(a => renderCard(a, true))}
                        </div>
                    )}
                </div>
            )}

            <div>
                <h4 className="text-sm font-medium text-zinc-500 mb-3">Aprobados</h4>
                {approved.length === 0 ? (
                    <div className="card py-10 text-center text-zinc-400 text-sm">
                        No hay artículos aprobados.
                    </div>
                ) : (
                    <div className="flex flex-wrap -mx-2 pb-10">
                        {approved.map(a => renderCard(a, false))}
                    </div>
                )}
            </div>

            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeDeleteModal} />
                    <div className="relative card p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar artículo</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este artículo?
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
