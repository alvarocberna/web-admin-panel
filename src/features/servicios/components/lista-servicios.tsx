'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Input, TextAreaArt, InputFile } from '@/shared';
import { ServiciosService } from '../services/servicios.service';
import { ServicioEntity } from '../entities/servicio.entity';

interface ServicioForm {
    nombre_servicio: string;
    descripcion: string;
    valor: number;
    nombre_promocion: string;
    porcentaje_descuento: number;
    destacado: string;
    activo: boolean;
    img_alt: string;
    image_file?: FileList;
}

interface Props {
    serviciosId: string;
    servicios: ServicioEntity[];
    onUpdated: (servicios: ServicioEntity[]) => void;
}

export function ListaServicios({ serviciosId, servicios, onUpdated }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState<ServicioEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [servicioToDelete, setServicioToDelete] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ServicioForm>({
        defaultValues: {
            nombre_servicio: '',
            descripcion: '',
            valor: 0,
            nombre_promocion: '',
            porcentaje_descuento: 0,
            destacado: 'false',
            activo: true,
            img_alt: '',
        },
    });

    const activo = watch('activo');
    const destacado = watch('destacado');

    const openCreate = () => {
        setEditingServicio(null);
        reset({
            nombre_servicio: '',
            descripcion: '',
            valor: 0,
            nombre_promocion: '',
            porcentaje_descuento: 0,
            destacado: 'false',
            activo: true,
            img_alt: '',
        });
        setModalOpen(true);
    };

    const openEdit = (servicio: ServicioEntity) => {
        setEditingServicio(servicio);
        reset({
            nombre_servicio: servicio.nombre_servicio,
            descripcion: servicio.descripcion ?? '',
            valor: servicio.valor ?? 0,
            nombre_promocion: servicio.nombre_promocion ?? '',
            porcentaje_descuento: servicio.porcentaje_descuento ?? 0,
            destacado: servicio.destacado ? 'true' : 'false',
            activo: servicio.activo,
            img_alt: servicio.img_alt ?? '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingServicio(null);
    };

    const onSubmit = async (data: ServicioForm) => {
        try {
            const payload = {
                nombre_servicio: data.nombre_servicio,
                descripcion: data.descripcion || null,
                valor: data.valor || null,
                nombre_promocion: data.nombre_promocion || null,
                porcentaje_descuento: data.porcentaje_descuento || null,
                destacado: data.destacado === 'true',
                icono: null,
                orden: null,
                activo: data.activo,
                img_url: editingServicio?.img_url ?? null,
                img_alt: data.img_alt || null,
                image_file: data.image_file,
            };

            if (editingServicio) {
                const actualizado = await ServiciosService.updateServicio(editingServicio.id, payload);
                onUpdated(servicios.map(s => s.id === actualizado.id ? actualizado : s));
                toast.success('Servicio actualizado correctamente');
            } else {
                const nuevo = await ServiciosService.createServicio(payload);
                onUpdated([...servicios, nuevo]);
                toast.success('Servicio creado correctamente');
            }
            closeModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el servicio');
        }
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
        try {
            await ServiciosService.deleteServicio(servicioToDelete);
            onUpdated(servicios.filter(s => s.id !== servicioToDelete));
            toast.success('Servicio eliminado correctamente');
            closeDeleteModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el servicio');
            closeDeleteModal();
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

            {/* Modal crear/editar */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                            <h3 className="text-base font-semibold text-zinc-900">
                                {editingServicio ? 'Editar servicio' : 'Nuevo servicio'}
                            </h3>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
                                <FontAwesomeIcon icon={faXmark} style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Nombre del servicio"
                                        name="nombre_servicio"
                                        register={register}
                                        rules={{ 
                                            required: 'El nombre del servicio es requerido',
                                            minLength: {value: 1, message: 'Mínimo 1 caracter'},
                                            maxLength: {value: 200, message: 'Máximo 200 caracteres'} 
                                        }}
                                    />
                                    {errors.nombre_servicio && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre_servicio.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        label="Valor"
                                        name="valor"
                                        type='number'
                                        register={register}
                                        rules={{ 
                                            required: false,
                                        }}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Nombre de promoción"
                                        name="nombre_promocion"
                                        register={register}
                                        rules={{ 
                                            required: false,
                                            maxLength: {value: 200, message: 'Máximo 200 caracteres'} 
                                         }}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Porcentaje de descuento"
                                        name="porcentaje_descuento"
                                        type='number'
                                        register={register}
                                        rules={{ required: false }}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputFile
                                        label="Imagen del servicio"
                                        name="image_file"
                                        register={register}
                                        currentImageUrl={editingServicio?.img_url}
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
                                rules={{ required: false }}
                            />

                            <div className="flex items-center justify-between mt-4 py-3 border-t border-zinc-100">
                                <div>
                                    <p className="text-sm font-medium text-zinc-800">Destacado</p>
                                    <p className="text-xs text-zinc-400">Marca este servicio como destacado.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setValue('destacado', destacado === 'true' ? 'false' : 'true')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${destacado === 'true' ? 'bg-yellow-400' : 'bg-zinc-300'}`}
                                    aria-label="Marcar como destacado"
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${destacado === 'true' ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-3 border-t border-zinc-100">
                                <div>
                                    <p className="text-sm font-medium text-zinc-800">Servicio activo</p>
                                    <p className="text-xs text-zinc-400">Muestra u oculta este servicio en el sitio web.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setValue('activo', activo === true ? false : true)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${activo === true ? 'bg-blue-600' : 'bg-zinc-300'}`}
                                    aria-label="Activar o desactivar servicio"
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
                                    {isSubmitting ? 'Guardando...' : editingServicio ? 'Guardar cambios' : 'Crear servicio'}
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
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar servicio</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este servicio?
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
