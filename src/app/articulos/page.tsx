'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContenedorAdmin, TitleSec, HeadSubSec } from '@/shared';
import { ArticulosService, ArticuloEntity, ArticulosEntity } from '@/features';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function Articulos(){
    const [articulos, setArticulos] = useState<ArticuloEntity[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
    const router = useRouter();

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const res: ArticulosEntity | null = await ArticulosService.getArticulos();
                const data = res?.articulo;
                setArticulos(data?? []);
            } catch(error) {
                console.log("error: " + error)
            }
        }
        fetchArticulos();
    }, []);

    const openModal = (id: string) => { setArticleToDelete(id); setModalOpen(true); }
    const closeModal = () => { setArticleToDelete(null); setModalOpen(false); }

    const confirmDelete = async () => {
        if (!articleToDelete) return;
        try {
            await ArticulosService.deleteArticulo(articleToDelete)
            setArticulos((prev: any[]) => prev.filter((a: any) => a.id !== articleToDelete))
            closeModal()
            router.refresh()
        } catch(error) {
            console.error('Error borrando articulo:', error)
            closeModal()
        }
    }

    const listaArticulos = articulos.map((articulo: ArticuloEntity) => {
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
                            <FontAwesomeIcon icon={faEye} style={{ width: '14px', height: '14px' }}/>
                        </Link>
                        <Link
                            href={`/articulos/${articulo.id}/modificar`}
                            className="btn btn-ghost flex-1 h-9 text-xs"
                            title="Editar artículo"
                        >
                            <FontAwesomeIcon icon={faPencil} style={{ width: '14px', height: '14px' }}/>
                        </Link>
                        <button
                            onClick={() => openModal(articulo.id)}
                            className="btn btn-ghost-destructive flex-1 h-9 text-xs"
                            title="Eliminar artículo"
                        >
                            <FontAwesomeIcon icon={faTrash} style={{ width: '14px', height: '14px' }}/>
                        </button>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <ContenedorAdmin>
            <TitleSec title="Artículos" />
            <HeadSubSec>
                <Link href="/articulos/crear">
                    <button className="btn btn-primary flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlus} style={{ width: '12px', height: '12px' }}/>
                        Nuevo artículo
                    </button>
                </Link>
            </HeadSubSec>

            {articulos.length === 0 ? (
                <div className="py-16 text-center text-zinc-400 text-sm">
                    No hay artículos publicados.
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2 pb-10 mt-4">
                    {listaArticulos}
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
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar artículo</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este artículo?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeModal} className="btn btn-outline">
                                Cancelar
                            </button>
                            <button onClick={confirmDelete} className="btn btn-destructive">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ContenedorAdmin>
    )
}
