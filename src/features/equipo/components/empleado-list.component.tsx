'use client'
//NEXT
import { useRouter } from 'next/navigation';
//REACT
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faGripVertical } from '@fortawesome/free-solid-svg-icons';
//DND-KIT
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
import { EquipoService, EmpleadoEntity, EmpleadoForm } from '@/features';


interface Props {
    empleados: EmpleadoEntity[];
}

interface CardProps {
    emp: EmpleadoEntity;
    onEdit: () => void;
    onDelete: () => void;
}

//card con info de empleado
function SortableCard({ emp, onEdit, onDelete }: CardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: emp.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                <div className="flex items-start justify-between mb-2">
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
                        <p className="text-sm font-semibold text-zinc-900 truncate">
                            {emp.nombrePrimero} {emp.apellidoPaterno}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">{emp.profesion}</p>
                        {emp.especialidad && (
                            <p className="text-xs text-zinc-400 truncate">{emp.especialidad}</p>
                        )}
                    </div>
                    <span className={`ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${emp.activo === true ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                        {emp.activo === true ? 'Activo' : 'Inactivo'}
                    </span>
                </div>

                {emp.descripcion && (
                    <p className="text-xs text-zinc-600 flex-1 line-clamp-2 mb-3">{emp.descripcion}</p>
                )}

                <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-zinc-100">
                    <button
                        onClick={onEdit}
                        className="btn btn-outline h-8 text-xs px-3"
                        title="Editar empleado"
                    >
                        <FontAwesomeIcon icon={faPencil} style={{ width: '11px', height: '11px' }} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="btn btn-ghost-destructive h-8 text-xs px-3"
                        title="Eliminar empleado"
                    >
                        <FontAwesomeIcon icon={faTrash} style={{ width: '11px', height: '11px' }} />
                    </button>
                </div>
            </div>
        </div>
    );
}


export function EmpleadoList({ empleados }: Props) {
    const router = useRouter(); //router para hacer refresh al actualizar el orden de los card
    const [items, setItems] = useState<EmpleadoEntity[]>(empleados); 
    const [modalOpen, setModalOpen] = useState(false);
    const [modalKey, setModalKey] = useState(0);
    const [editingEmpleado, setEditingEmpleado] = useState<EmpleadoEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [empleadoToDelete, setEmpleadoToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setItems(empleados);
    }, [empleados]);

    const sensors = useSensors(
        useSensor(PointerSensor, { //evento de puntero activa el movimiento
            activationConstraint: { distance: 8 } //se mueve cuando el puntero se mueve al menos 8px
        })
    );

    //handler que se ejecuta cuando el usuario suelta el elemento dps de arrastrarlo
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex(e => e.id === active.id);
        const newIndex = items.findIndex(e => e.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        const prevOrden = newIndex > 0
            ? parseFloat(newItems[newIndex - 1].orden ?? '0')
            : 0;
        const nextOrden = newIndex < newItems.length - 1
            ? parseFloat(newItems[newIndex + 1].orden ?? '0')
            : parseFloat(newItems[newIndex - 1].orden ?? '0') + 1000;

        const newOrden = (prevOrden + nextOrden) / 2;

        const optimistic = newItems.map((e, i) =>
            i === newIndex ? { ...e, orden: newOrden.toString() } : e
        );
        setItems(optimistic);

        EquipoService.updateEmpleadoOrden(active.id as string, newOrden)
            .then(saved => {
                setItems(curr => curr.map(e => e.id === saved.id ? saved : e));
                router.refresh();
            })
            .catch(() => {
                setItems(items);
                toast.error('Error al actualizar el orden');
            });
    };

    const openCreate = () => {
        setEditingEmpleado(null);
        setModalKey(k => k + 1);
        setModalOpen(true);
    };

    const openEdit = (empleado: EmpleadoEntity) => {
        setEditingEmpleado(empleado);
        setModalKey(k => k + 1);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingEmpleado(null);
    };

    const handleSaved = (saved: EmpleadoEntity, wasEditing: boolean) => {
        if (wasEditing) {
            setItems(curr => curr.map(e => e.id === saved.id ? saved : e));
        } else {
            setItems(curr => [...curr, saved]);
        }
        router.refresh();
    };

    const openDeleteModal = (id: string) => {
        setEmpleadoToDelete(id);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setEmpleadoToDelete(null);
        setDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!empleadoToDelete) return;
        setIsDeleting(true);
        try {
            await EquipoService.deleteEmpleado(empleadoToDelete);
            setItems(curr => curr.filter(e => e.id !== empleadoToDelete));
            toast.success('Empleado eliminado correctamente');
            closeDeleteModal();
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el empleado');
            closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                {/* titulo */}
                <h3 className="text-md font-semibold text-zinc-900">Miembros del equipo</h3>
                {/* boton para crear empleado */}
                <button type="button" onClick={openCreate} className="btn btn-primary h-8 text-xs px-3 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPlus} style={{ width: '11px', height: '11px' }} />
                    Nuevo empleado
                </button>
            </div>

            {items.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay empleados registrados.
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(e => e.id)} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap -mx-2">
                            {/* lista de cards empleados */}
                            {items.map(emp => (
                                <SortableCard
                                    key={emp.id}
                                    emp={emp}
                                    onEdit={() => openEdit(emp)}
                                    onDelete={() => openDeleteModal(emp.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* form para crear / editar empleado */}
            <EmpleadoForm
                key={modalKey}
                open={modalOpen}
                editingEmpleado={editingEmpleado}
                onClose={closeModal}
                onSaved={handleSaved}
            />

            {/* modal para eliminar cards empleado */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeDeleteModal} />
                    <div className="relative card p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar empleado</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este empleado?
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
