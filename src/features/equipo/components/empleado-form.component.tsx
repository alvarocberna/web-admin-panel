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
    idSec?: string;
    tituloSec: string;
    contenidoSec: string;
    imageFile?: FileList;
    imageUrl?: string | null;
    imageAlt?: string;
    imagePosition?: string;
}

interface EmpleadoForm {
    nombrePrimero: string;
    nombreSegundo: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    profesion: string;
    especialidad: string;
    descripcion: string;
    activo: boolean;
    imgAlt: string;
    imageFile?: FileList;
    secEmpleado: SecEmpleadoForm[];
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
            nombrePrimero: '',
            nombreSegundo: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            profesion: '',
            especialidad: '',
            descripcion: '',
            activo: true,
            imgAlt: '',
            secEmpleado: [],
        },
    });

    const { fields: secFields, append: appendSec, remove: removeSec } = useFieldArray({
        control,
        name: 'secEmpleado',
    });

    const activo = watch('activo');

    useEffect(() => {
        if (!open) return;
        if (editingEmpleado) {
            const sections = editingEmpleado.secEmpleado?.map(sec => ({
                idSec: sec.id,
                tituloSec: sec.tituloSec ?? '',
                contenidoSec: sec.contenidoSec ?? '',
                imageUrl: sec.imageUrl ?? null,
                imageAlt: sec.imageAlt ?? '',
                imagePosition: sec.imagePosition ?? 'none',
            })) ?? [];
            reset({
                nombrePrimero: editingEmpleado.nombrePrimero,
                nombreSegundo: editingEmpleado.nombreSegundo ?? '',
                apellidoPaterno: editingEmpleado.apellidoPaterno,
                apellidoMaterno: editingEmpleado.apellidoMaterno ?? '',
                profesion: editingEmpleado.profesion ?? '',
                especialidad: editingEmpleado.especialidad ?? '',
                descripcion: editingEmpleado.descripcion ?? '',
                activo: editingEmpleado.activo,
                imgAlt: editingEmpleado.imgAlt ?? '',
                secEmpleado: sections,
            });
        } else {
            reset({
                nombrePrimero: '',
                nombreSegundo: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                profesion: '',
                especialidad: '',
                descripcion: '',
                activo: true,
                imgAlt: '',
                secEmpleado: [],
            });
        }
        setAddSec(true);
    }, [open, editingEmpleado, reset]);

    const onSubmit = async (data: EmpleadoForm) => {
        try {
            const payload = {
                nombrePrimero: stripTags(data.nombrePrimero),
                nombreSegundo: stripTags(data.nombreSegundo) || null,
                apellidoPaterno: stripTags(data.apellidoPaterno),
                apellidoMaterno: stripTags(data.apellidoMaterno) || null,
                profesion: stripTags(data.profesion),
                especialidad: stripTags(data.especialidad) || null,
                descripcion: stripTags(data.descripcion) || null,
                orden: null,
                activo: data.activo,
                imgUrl: editingEmpleado?.imgUrl ?? null,
                imgAlt: stripTags(data.imgAlt) || null,
                slug: null,
                imageFile: data.imageFile,
                secEmpleado: data.secEmpleado,
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
                                name="nombrePrimero"
                                register={register}
                                rules={{
                                    required: 'El primer nombre es requerido',
                                    minLength: {value: 1, message: 'Mínimo 1 caracter'},
                                    maxLength: {value: 50, message: 'Máximo 50 caracteres'}
                                 }}
                            />
                            {errors.nombrePrimero && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombrePrimero.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Segundo nombre"
                                name="nombreSegundo"
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
                                name="apellidoPaterno"
                                register={register}
                                rules={{
                                    required: 'El apellido paterno es requerido',
                                    minLength: {value: 1, message: 'Mínimo 1 caracter'},
                                    maxLength: {value: 50, message: 'Máximo 50 caracteres'}
                                }}
                            />
                            {errors.apellidoPaterno && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.apellidoPaterno.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Apellido materno"
                                name="apellidoMaterno"
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
                                name="imageFile"
                                register={register}
                                currentImageUrl={editingEmpleado?.imgUrl}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Input
                                label="Texto alternativo de la imagen (alt)"
                                name="imgAlt"
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
                                        name={`secEmpleado.${index}.tituloSec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }}
                                    />
                                    <TextAreaArt
                                        label="Contenido"
                                        name={`secEmpleado.${index}.contenidoSec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 5000, message: 'Máximo 5000 caracteres' } }}
                                    />
                                    {field.imagePosition !== 'none' && (
                                        <InputFile
                                            label="Imagen"
                                            name={`secEmpleado.${index}.imageFile` as any}
                                            register={register}
                                            currentImageUrl={field.imageUrl}
                                        />
                                    )}
                                    {field.imagePosition !== 'none' && (
                                        <Input
                                            label="Texto alternativo de la imagen (alt)"
                                            name={`secEmpleado.${index}.imageAlt` as any}
                                            register={register}
                                            rules={{ required: false, maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
                                        />
                                    )}
                                    <input type="hidden" {...register(`secEmpleado.${index}.imagePosition` as any)} />
                                    <input type="hidden" {...register(`secEmpleado.${index}.idSec` as any)} />
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
                                                appendSec({ idSec: '', tituloSec: '', contenidoSec: '', imageFile: undefined, imageAlt: '', imagePosition: position });
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
