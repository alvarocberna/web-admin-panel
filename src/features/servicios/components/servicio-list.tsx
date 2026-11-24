'use client'
//REACT
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
//NEXT
import { useRouter } from 'next/navigation';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faGripVertical } from '@fortawesome/free-solid-svg-icons';
//DROP AND DRAG
import {
    DndContext, closestCenter, DragEndEvent,
    PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    SortableContext, rectSortingStrategy,
    useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
//FEATURES
import {ServiciosService, ServicioEntity, ServicioForm } from '@/features'


interface Props {
    servicios: ServicioEntity[];
}

interface CardProps {
    srv: ServicioEntity;
    onEdit: () => void;
    onDelete: () => void;
}


//card servicio
function SortableCard({ srv, onEdit, onDelete }: CardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: srv.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                <div className="flex items-start justify-between mb-2">
                    {/* btn arrastrar */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="mr-2 mt-0.5 text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing flex-shrink-0"
                        title="Arrastrar para reordenar"
                        type="button"
                    >
                        <FontAwesomeIcon icon={faGripVertical} style={{ width: '11px', height: '11px' }} />
                    </button>
                    <div className="flex-1 min-w-0">
                        {/* nombre servicio */}
                        <p className="text-sm font-semibold text-zinc-900 truncate">{srv.nombreServicio}</p>
                        {/* valor servicio */}
                        {srv.valor && (
                            <p className="text-xs text-zinc-500 truncate">{srv.valor}</p>
                        )}
                        {/* destacado */}
                        {srv.destacado && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700 mt-1 inline-block">
                                Destacado
                            </span>
                        )}
                    </div>
                    {/* activo */}
                    <span className={`ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${srv.activo === true ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                        {srv.activo === true ? 'Activo' : 'Inactivo'}
                    </span>
                </div>

                {/* descripcion */}
                {srv.descripcion && (
                    <p className="text-xs text-zinc-600 flex-1 line-clamp-2 mb-3">{srv.descripcion}</p>
                )}

                <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-zinc-100">
                    {/* btn editar */}
                    <button
                        onClick={onEdit}
                        className="btn btn-outline h-8 text-xs px-3"
                        title="Editar servicio"
                    >
                        <FontAwesomeIcon icon={faPencil} style={{ width: '11px', height: '11px' }} />
                    </button>
                    {/* btn eliminar */}
                    <button
                        onClick={onDelete}
                        className="btn btn-ghost-destructive h-8 text-xs px-3"
                        title="Eliminar servicio"
                    >
                        <FontAwesomeIcon icon={faTrash} style={{ width: '11px', height: '11px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}


export function ServicioList({ servicios }: Props) {
    const router = useRouter(); //router para hacer refresh al actualizar la list
    const [items, setItems] = useState<ServicioEntity[]>(servicios);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState<ServicioEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [servicioToDelete, setServicioToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setItems(servicios);
    }, [servicios]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex(s => s.id === active.id);
        const newIndex = items.findIndex(s => s.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        const prevOrden = newIndex > 0
            ? parseFloat(newItems[newIndex - 1].orden ?? '0')
            : 0;
        const nextOrden = newIndex < newItems.length - 1
            ? parseFloat(newItems[newIndex + 1].orden ?? '0')
            : parseFloat(newItems[newIndex - 1].orden ?? '0') + 1000;

        const newOrden = (prevOrden + nextOrden) / 2;

        const optimistic = newItems.map((s, i) =>
            i === newIndex ? { ...s, orden: newOrden.toString() } : s
        );
        setItems(optimistic);

        ServiciosService.updateServicioOrden(active.id as string, newOrden)
            .then(saved => {
                setItems(curr => curr.map(s => s.id === saved.id ? saved : s));
                router.refresh();
            })
            .catch(() => {
                setItems(items);
                toast.error('Error al actualizar el orden');
            });
    };

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

    const handleSaved = (saved: ServicioEntity, wasEditing: boolean) => {
        if (wasEditing) {
            setItems(curr => curr.map(s => s.id === saved.id ? saved : s));
        } else {
            setItems(curr => [...curr, saved]);
        }
        router.refresh();
        closeModal();
    };

    const confirmDelete = async () => {
        if (!servicioToDelete) return;
        setIsDeleting(true);
        try {
            await ServiciosService.deleteServicio(servicioToDelete);
            setItems(curr => curr.filter(s => s.id !== servicioToDelete));
            toast.success('Servicio eliminado correctamente');
            closeDeleteModal();
            router.refresh();
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

            {items.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay servicios registrados.
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(s => s.id)} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap -mx-2">
                            {items.map(srv => (
                                <SortableCard
                                    key={srv.id}
                                    srv={srv}
                                    onEdit={() => openEdit(srv)}
                                    onDelete={() => openDeleteModal(srv.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {modalOpen && (
                <ServicioForm
                    editingServicio={editingServicio}
                    onSaved={handleSaved}
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
