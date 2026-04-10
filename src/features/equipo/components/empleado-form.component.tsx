'use client'
//NEXT
import Image from 'next/image';
//REACT
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
//SHARED
import { Input, TextAreaArt, InputFile, stripTags } from '@/shared';
//FEATURES
import { EquipoService, EmpleadoEntity } from '@/features';

interface SecEmpleadoForm {
    id_sec?: string;
    titulo_sec: string;
    contenido_sec: string;
    image_file?: FileList;
    image_url?: string | null;
    image_alt?: string;
    image_position?: string;
}

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
    sec_empleado: SecEmpleadoForm[];
}

interface Props {
    open: boolean;
    editingEmpleado: EmpleadoEntity | null;
    onClose: () => void;
    onSaved: (saved: EmpleadoEntity, wasEditing: boolean) => void;
}

export function EmpleadoForm({ open, editingEmpleado, onClose, onSaved }: Props) {
    const [addSec, setAddSec] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
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
            sec_empleado: [],
        },
    });

    const { fields: secFields, append: appendSec, remove: removeSec } = useFieldArray({
        control,
        name: 'sec_empleado',
    });

    const activo = watch('activo');

    useEffect(() => {
        if (!open) return;
        if (editingEmpleado) {
            reset({
                nombre_primero: editingEmpleado.nombre_primero,
                nombre_segundo: editingEmpleado.nombre_segundo ?? '',
                apellido_paterno: editingEmpleado.apellido_paterno,
                apellido_materno: editingEmpleado.apellido_materno ?? '',
                profesion: editingEmpleado.profesion ?? '',
                especialidad: editingEmpleado.especialidad ?? '',
                descripcion: editingEmpleado.descripcion ?? '',
                activo: editingEmpleado.activo,
                img_alt: editingEmpleado.img_alt ?? '',
                sec_empleado: editingEmpleado.sec_empleado?.map(sec => ({
                    id_sec: sec.id,
                    titulo_sec: sec.titulo_sec ?? '',
                    contenido_sec: sec.contenido_sec ?? '',
                    image_url: sec.image_url ?? null,
                    image_alt: sec.image_alt ?? '',
                    image_position: sec.image_position ?? 'none',
                })) ?? [],
            });
        } else {
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
                sec_empleado: [],
            });
        }
        setAddSec(true);
    }, [open, editingEmpleado, reset]);

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
                sec_empleado: data.sec_empleado,
            };

            if (editingEmpleado) {
                const actualizado = await EquipoService.updateEmpleado(editingEmpleado.id, payload);
                toast.success('Empleado actualizado correctamente');
                onSaved(actualizado, true);
            } else {
                const nuevo = await EquipoService.createEmpleado(payload);
                toast.success('Empleado creado correctamente');
                onSaved(nuevo, false);
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el empleado');
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                    <h3 className="text-base font-semibold text-zinc-900">
                        {editingEmpleado ? 'Editar empleado' : 'Nuevo empleado'}
                    </h3>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
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

                    {/* Secciones del empleado */}
                    <div className="mt-4 border-t border-zinc-100 pt-4">
                        <p className="text-sm font-medium text-zinc-800 mb-3">Secciones adicionales</p>
                        <div className="space-y-3">
                            {secFields.map((field, index) => (
                                <div key={field.id} className="relative border border-zinc-200 rounded-xl p-4">
                                    <button
                                        type="button"
                                        onClick={() => removeSec(index)}
                                        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-150 text-xs font-bold"
                                        title="Eliminar sección"
                                    >
                                        ✕
                                    </button>
                                    <p className="text-xs font-semibold text-zinc-500 mb-2">Sección {index + 1}</p>
                                    <Input
                                        label="Título"
                                        name={`sec_empleado.${index}.titulo_sec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }}
                                    />
                                    <TextAreaArt
                                        label="Contenido"
                                        name={`sec_empleado.${index}.contenido_sec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 5000, message: 'Máximo 5000 caracteres' } }}
                                    />
                                    {field.image_position !== 'none' && (
                                        <InputFile
                                            label="Imagen"
                                            name={`sec_empleado.${index}.image_file` as any}
                                            register={register}
                                            currentImageUrl={field.image_url}
                                        />
                                    )}
                                    {field.image_position !== 'none' && (
                                        <Input
                                            label="Texto alternativo de la imagen (alt)"
                                            name={`sec_empleado.${index}.image_alt` as any}
                                            register={register}
                                            rules={{ required: false, maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
                                        />
                                    )}
                                    <input type="hidden" {...register(`sec_empleado.${index}.image_position` as any)} />
                                    <input type="hidden" {...register(`sec_empleado.${index}.id_sec` as any)} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-3">
                            {addSec ? (
                                <button
                                    type="button"
                                    onClick={() => setAddSec(false)}
                                    className="btn btn-outline w-full h-10 text-sm"
                                >
                                    + Agregar sección
                                </button>
                            ) : (
                                <div className="flex gap-2 border border-blue-200 bg-blue-50 rounded-xl p-3">
                                    {[
                                        { label: 'Sin imagen', position: 'none', preview: <div className="w-full h-full bg-zinc-300 rounded-sm" /> },
                                        { label: 'Img izquierda', position: 'left', preview: (
                                            <>
                                                <div className="w-[45%] h-full bg-zinc-400 rounded-sm overflow-hidden">
                                                    <Image src="/image.png" width={100} height={100} alt="img" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="w-[45%] h-full bg-zinc-300 rounded-sm" />
                                            </>
                                        )},
                                        { label: 'Img derecha', position: 'right', preview: (
                                            <>
                                                <div className="w-[45%] h-full bg-zinc-300 rounded-sm" />
                                                <div className="w-[45%] h-full bg-zinc-400 rounded-sm overflow-hidden">
                                                    <Image src="/image.png" width={100} height={100} alt="img" className="w-full h-full object-cover" />
                                                </div>
                                            </>
                                        )},
                                        { label: 'Solo imagen', position: 'all', preview: (
                                            <div className="w-full h-full bg-zinc-400 rounded-sm overflow-hidden">
                                                <Image src="/image.png" width={100} height={100} alt="img" className="w-full h-full object-cover" />
                                            </div>
                                        )},
                                    ].map(({ label, position, preview }) => (
                                        <button
                                            key={position}
                                            type="button"
                                            onClick={() => {
                                                setAddSec(true);
                                                appendSec({ id_sec: '', titulo_sec: '', contenido_sec: '', image_file: undefined, image_alt: '', image_position: position });
                                            }}
                                            className="flex-1 flex flex-col items-center gap-1.5 group"
                                            title={label}
                                        >
                                            <div className="w-full h-10 flex gap-1 bg-white border border-zinc-200 rounded-lg p-1.5 group-hover:border-blue-400 group-hover:bg-blue-50 transition-colors duration-150">
                                                {preview}
                                            </div>
                                            <span className="text-[10px] text-zinc-500 group-hover:text-blue-600">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="btn btn-outline">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : editingEmpleado ? 'Guardar cambios' : 'Crear empleado'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
