'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Input, TextAreaArt, InputFile, stripTags } from '@/shared';
import { EquipoService } from '../services/equipo.service';
import { EmpleadoEntity } from '../entities/empleado.entity';

interface EmpleadoForm {
    nombre_primero: string;
    nombre_segundo: string;
    apellido_paterno: string;
    apellido_materno: string;
    profesion: string;
    especialidad: string;
    descripcion: string;
    activo: boolean;
    img_alt: string;
    image_file?: FileList;
}

interface Props {
    empleados: EmpleadoEntity[];
    onUpdated: (empleados: EmpleadoEntity[]) => void;
}

export function Empleados({ empleados, onUpdated }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState<EmpleadoEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [empleadoToDelete, setEmpleadoToDelete] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<EmpleadoForm>({
        defaultValues: {
            nombre_primero: '',
            nombre_segundo: '',
            apellido_paterno: '',
            apellido_materno: '',
            profesion: '',
            especialidad: '',
            descripcion: '',
            activo: true,
            img_alt: '',
        },
    });

    const activo = watch('activo');

    const openCreate = () => {
        setEditingEmpleado(null);
        reset({
            nombre_primero: '',
            nombre_segundo: '',
            apellido_paterno: '',
            apellido_materno: '',
            profesion: '',
            especialidad: '',
            descripcion: '',
            activo: true,
            img_alt: '',
        });
        setModalOpen(true);
    };

    //guardamos la info del empleado seleccionado en 'empleado'
    const openEdit = (empleado: EmpleadoEntity) => {
        setEditingEmpleado(empleado);
        reset({
            nombre_primero: empleado.nombre_primero,
            nombre_segundo: empleado.nombre_segundo ??  '',
            apellido_paterno: empleado.apellido_paterno,
            apellido_materno: empleado.apellido_materno ?? '',
            profesion: empleado.profesion ?? '',
            especialidad: empleado.especialidad ?? '',
            descripcion: empleado.descripcion ?? '',
            activo: empleado.activo,
            img_alt: empleado.img_alt ?? '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingEmpleado(null);
    };

    const onSubmit = async (data: EmpleadoForm) => {
        try {
            const payload = {
                nombre_primero: stripTags(data.nombre_primero),
                nombre_segundo: stripTags(data.nombre_segundo) || null,
                apellido_paterno: stripTags(data.apellido_paterno),
                apellido_materno: stripTags(data.apellido_materno) || null,
                profesion: stripTags(data.profesion),
                especialidad: stripTags(data.especialidad) || null,
                descripcion: stripTags(data.descripcion) || null,
                orden: null,
                activo: data.activo,
                img_url: editingEmpleado?.img_url ?? null,
                img_alt: stripTags(data.img_alt) || null,
                slug: null,
                image_file: data.image_file,
            };

            if (editingEmpleado) {
                const actualizado = await EquipoService.updateEmpleado(editingEmpleado.id, payload);
                onUpdated(empleados.map(e => e.id === actualizado.id ? actualizado : e));
                toast.success('Empleado actualizado correctamente');
            } else {
                const nuevo = await EquipoService.createEmpleado(payload);
                onUpdated([...empleados, nuevo]);
                toast.success('Empleado creado correctamente');
            }
            closeModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el empleado');
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

            {/* Modal crear/editar */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                            <h3 className="text-base font-semibold text-zinc-900">
                                {editingEmpleado ? 'Editar empleado' : 'Nuevo empleado'}
                            </h3>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
                                <FontAwesomeIcon icon={faXmark} style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <div>
                                    <Input
                                        label="Primer nombre"
                                        name="nombre_primero"
                                        register={register}
                                        rules={{ 
                                            required: 'El primer nombre es requerido',
                                            minLength: {value: 1, message: 'Mínimo 1 caracter'},
                                            maxLength: {value: 50, message: 'Máximo 50 caracteres'}
                                         }}
                                    />
                                    {errors.nombre_primero && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre_primero.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label="Segundo nombre"
                                        name="nombre_segundo"
                                        register={register}
                                        rules={{ 
                                            required: false,
                                            maxLength: {value: 50, message: 'Máximo 50 caracteres'}
                                         }}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Apellido paterno"
                                        name="apellido_paterno"
                                        register={register}
                                        rules={{
                                            required: 'El apellido paterno es requerido',
                                            minLength: {value: 1, message: 'Mínimo 1 caracter'},
                                            maxLength: {value: 50, message: 'Máximo 50 caracteres'}
                                        }}
                                    />
                                    {errors.apellido_paterno && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.apellido_paterno.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label="Apellido materno"
                                        name="apellido_materno"
                                        register={register}
                                        rules={{ 
                                            required: false,
                                            maxLength: {value: 50, message: 'Máximo 50 caracteres'}
                                        }}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Profesión"
                                        name="profesion"
                                        register={register}
                                        rules={{ 
                                            required: false,
                                            maxLength: {value: 100, message: 'Máximo 100 caracteres'}
                                         }}
                                    />
                                    {errors.profesion && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.profesion.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label="Especialidad"
                                        name="especialidad"
                                        register={register}
                                        rules={{ 
                                            required: false,
                                            maxLength: {value: 200, message: 'Máximo 200 caracteres'}
                                         }}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputFile
                                        label="Imagen del empleado"
                                        name="image_file"
                                        register={register}
                                        currentImageUrl={editingEmpleado?.img_url}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Texto alternativo de la imagen (alt)"
                                        name="img_alt"
                                        register={register}
                                        rules={{ 
                                            required: false,
                                            maxLength: {value: 100, message: 'Máximo 100 caracteres'}
                                        }}
                                    />
                                </div>
                            </div>

                            <TextAreaArt
                                label="Descripción"
                                name="descripcion"
                                register={register}
                                rules={{ 
                                    required: false,
                                    maxLength: {value: 500, message: 'Máximo 500 caracteres'}
                                 }}
                            />

                            <div className="flex items-center justify-between mt-4 py-3 border-t border-zinc-100">
                                <div>
                                    <p className="text-sm font-medium text-zinc-800">Empleado activo</p>
                                    <p className="text-xs text-zinc-400">Muestra u oculta este empleado en el sitio web.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setValue('activo', activo === true ? false : true)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${activo === true ? 'bg-blue-600' : 'bg-zinc-300'}`}
                                    aria-label="Activar o desactivar empleado"
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${activo === true ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="mt-5 flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : editingEmpleado ? 'Guardar cambios' : 'Crear empleado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
