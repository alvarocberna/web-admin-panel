'use client'
//REACT
import { useState } from 'react';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
//FEATURES
import { EquipoService, EmpleadoEntity, EmpleadoForm } from '@/features';


interface Props {
    empleados: EmpleadoEntity[];
    onUpdated: (empleados: EmpleadoEntity[]) => void;
}


export function EmpleadoList({ empleados, onUpdated }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState<EmpleadoEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [empleadoToDelete, setEmpleadoToDelete] = useState<string | null>(null);

    const openCreate = () => {
        setEditingEmpleado(null);
        setModalOpen(true);
    };

    const openEdit = (empleado: EmpleadoEntity) => {
        setEditingEmpleado(empleado);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingEmpleado(null);
    };

    const handleSaved = (saved: EmpleadoEntity, wasEditing: boolean) => {
        if (wasEditing) {
            onUpdated(empleados.map(e => e.id === saved.id ? saved : e));
        } else {
            onUpdated([...empleados, saved]);
        }
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
        try {
            await EquipoService.deleteEmpleado(empleadoToDelete);
            onUpdated(empleados.filter(e => e.id !== empleadoToDelete));
            toast.success('Empleado eliminado correctamente');
            closeDeleteModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el empleado');
            closeDeleteModal();
        }
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-zinc-900">Miembros del equipo</h3>
                <button type="button" onClick={openCreate} className="btn btn-primary h-8 text-xs px-3 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPlus} style={{ width: '11px', height: '11px' }} />
                    Nuevo empleado
                </button>
            </div>

            {empleados.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay empleados registrados.
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2">
                    {empleados.map(emp => (
                        <div key={emp.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                            <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">
                                            {emp.nombre_primero} {emp.apellido_paterno}
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

                                {emp.orden && (
                                    <p className="text-xs text-zinc-400 mb-2">Orden: {emp.orden}</p>
                                )}

                                <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-zinc-100">
                                    <button
                                        onClick={() => openEdit(emp)}
                                        className="btn btn-outline h-8 text-xs px-3"
                                        title="Editar empleado"
                                    >
                                        <FontAwesomeIcon icon={faPencil} style={{ width: '11px', height: '11px' }} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(emp.id)}
                                        className="btn btn-ghost-destructive h-8 text-xs px-3"
                                        title="Eliminar empleado"
                                    >
                                        <FontAwesomeIcon icon={faTrash} style={{ width: '11px', height: '11px' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <EmpleadoForm
                open={modalOpen}
                editingEmpleado={editingEmpleado}
                onClose={closeModal}
                onSaved={handleSaved}
            />

            {/* Modal confirmación eliminar */}
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
                            <button onClick={confirmDelete} className="btn btn-destructive">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
