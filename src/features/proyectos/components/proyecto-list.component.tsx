'use client'
//REACT
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faXmark, faChevronRight } from '@fortawesome/free-solid-svg-icons';
//SHARED
import { Input } from '@/shared';
//FEATURS
import { ProyectoService, ProyectoEntity, ProyectoForm } from '@/features';

interface EditForm {
    nombre_proyecto: string;
    descripcion: string;
    cliente: string;
    activo: boolean;
}

interface Props {
    onSelectProyecto: (proyecto: ProyectoEntity) => void;
}

export function ProyectoList({ onSelectProyecto }: Props) {
    const [proyectos, setProyectos] = useState<ProyectoEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [crearModalOpen, setCrearModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingProyecto, setEditingProyecto] = useState<ProyectoEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [proyectoToDelete, setProyectoToDelete] = useState<ProyectoEntity | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditForm>();

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const data = await ProyectoService.getProyectosAll();
                setProyectos(data);
            } catch (error) {
                toast.error('Error al cargar los proyectos');
            } finally {
                setLoading(false);
            }
        };
        fetchProyectos();
    }, []);

    const openEdit = (e: React.MouseEvent, proyecto: ProyectoEntity) => {
        e.stopPropagation();
        setEditingProyecto(proyecto);
        reset({
            nombre_proyecto: proyecto.nombre_proyecto,
            descripcion: proyecto.descripcion,
            cliente: proyecto.cliente,
            activo: proyecto.activo,
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (e: React.MouseEvent, proyecto: ProyectoEntity) => {
        e.stopPropagation();
        setProyectoToDelete(proyecto);
        setDeleteModalOpen(true);
    };

    const onSubmitEdit = async (data: EditForm) => {
        if (!editingProyecto) return;
        try {
            const updated = await ProyectoService.updateProyecto(editingProyecto.id, data);
            setProyectos(prev => prev.map(p => p.id === updated.id ? updated : p));
            toast.success('Proyecto actualizado correctamente');
            setEditModalOpen(false);
        } catch (error: any) {
            toast.error(error?.message || 'Error al actualizar el proyecto');
        }
    };

    const confirmDelete = async () => {
        if (!proyectoToDelete) return;
        try {
            await ProyectoService.deleteProyecto(proyectoToDelete.id);
            setProyectos(prev => prev.filter(p => p.id !== proyectoToDelete.id));
            toast.success('Proyecto eliminado correctamente');
            setDeleteModalOpen(false);
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el proyecto');
            setDeleteModalOpen(false);
        }
    };

    const onProyectoCreado = (nuevo: ProyectoEntity) => {
        setProyectos(prev => [...prev, nuevo]);
        setCrearModalOpen(false);
    };

    if (loading) return <div className="py-16 text-center text-zinc-400 text-sm">Cargando...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-500">
                    {proyectos.length} {proyectos.length === 1 ? 'proyecto' : 'proyectos'}
                </p>
                <button
                    type="button"
                    onClick={() => setCrearModalOpen(true)}
                    className="btn btn-primary h-8 text-xs px-3 flex items-center gap-1.5"
                >
                    <FontAwesomeIcon icon={faPlus} style={{ width: '11px', height: '11px' }} />
                    Nuevo proyecto
                </button>
            </div>

            {proyectos.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay proyectos registrados.
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100">
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Nombre</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Estado</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Fecha creación</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {proyectos.map(p => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-zinc-50 transition-colors cursor-pointer"
                                    onClick={() => onSelectProyecto(p)}
                                >
                                    <td className="px-5 py-3.5 font-medium text-zinc-900">
                                        <div className="flex items-center gap-2">
                                            {p.nombre_proyecto}
                                            <FontAwesomeIcon
                                                icon={faChevronRight}
                                                className="text-zinc-300"
                                                style={{ width: '10px', height: '10px' }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${p.activo ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-zinc-500">
                                        {p.fecha_inicio ? new Date(p.fecha_inicio).toLocaleDateString('es-CL') : '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => openEdit(e, p)}
                                                className="btn btn-outline h-7 text-xs px-2.5"
                                                title="Editar proyecto"
                                            >
                                                <FontAwesomeIcon icon={faPencil} style={{ width: '11px', height: '11px' }} />
                                            </button>
                                            <button
                                                onClick={(e) => openDeleteModal(e, p)}
                                                className="btn btn-ghost-destructive h-7 text-xs px-2.5"
                                                title="Eliminar proyecto"
                                            >
                                                <FontAwesomeIcon icon={faTrash} style={{ width: '11px', height: '11px' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal crear */}
            {crearModalOpen && (
                <ProyectoForm onClose={() => setCrearModalOpen(false)} onCreado={onProyectoCreado} />
            )}

            {/* Modal editar */}
            {editModalOpen && editingProyecto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setEditModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                            <h3 className="text-base font-semibold text-zinc-900">Editar proyecto</h3>
                            <button
                                type="button"
                                onClick={() => setEditModalOpen(false)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
                            >
                                <FontAwesomeIcon icon={faXmark} style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmitEdit)} noValidate className="px-6 py-5 flex flex-col gap-3">
                            <div>
                                <Input label="Nombre del proyecto" name="nombre_proyecto" register={register} rules={{ required: 'El nombre es requerido', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }} />
                                {errors.nombre_proyecto && <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre_proyecto.message}</p>}
                            </div>
                            <div>
                                <Input label="Descripción" name="descripcion" register={register} rules={{ required: 'La descripción es requerida', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 500, message: 'Máximo 500 caracteres' } }} />
                                {errors.descripcion && <p className="text-xs text-red-500 mt-1 ml-1">{errors.descripcion.message}</p>}
                            </div>
                            <div>
                                <Input label="Cliente" name="cliente" register={register} rules={{ required: 'El cliente es requerido', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }} />
                                {errors.cliente && <p className="text-xs text-red-500 mt-1 ml-1">{errors.cliente.message}</p>}
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" {...register('activo')} className="w-4 h-4 rounded border-zinc-300 accent-zinc-900" />
                                <span className="text-sm text-zinc-700">Activo</span>
                            </label>
                            <div className="mt-3 flex justify-end gap-2">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-outline">Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal confirmar eliminar */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setDeleteModalOpen(false)} />
                    <div className="relative card p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar proyecto</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar{' '}
                            <span className="font-medium text-zinc-700">{proyectoToDelete?.nombre_proyecto}</span>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-outline">Cancelar</button>
                            <button onClick={confirmDelete} className="btn btn-destructive">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
