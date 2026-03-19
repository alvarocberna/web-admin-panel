'use client'
import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ArticulosService } from '../services/articulos.service';
import { ArticuloEntity } from '../entities/articulo.entity';
import { toast } from 'react-toastify';

interface Props {
    articulos: ArticuloEntity[];
    onUpdated: (articulos: ArticuloEntity[]) => void;
}

export function ListaArticulos({ articulos, onUpdated }: Props) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

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
        try {
            await ArticulosService.deleteArticulo(articleToDelete);
            onUpdated(articulos.filter(a => a.id !== articleToDelete));
            toast.success('Artículo eliminado correctamente');
            closeDeleteModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el artículo');
            closeDeleteModal();
        }
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-zinc-900">Artículos</h3>
                <Link href="/articulos/crear">
                    <button type="button" className="btn btn-primary h-8 text-xs px-3 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faPlus} style={{ width: '11px', height: '11px' }} />
                        Nuevo artículo
                    </button>
                </Link>
            </div>

            {articulos.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay artículos publicados.
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2 pb-10">
                    {articulos.map((articulo) => {
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
                                    <p className="mb-5 text-xs text-zinc-400">{dia}/{mes}/{anno}</p>
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
                    })}
                </div>
            )}

            {/* Modal confirmación eliminar */}
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
                            <button onClick={confirmDelete} className="btn btn-destructive">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
