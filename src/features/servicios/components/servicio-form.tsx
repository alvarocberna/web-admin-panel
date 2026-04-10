'use client'
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { Input, TextAreaArt, InputFile } from '@/shared';
import { ServiciosService } from '../services/servicios.service';
import { ServicioEntity } from '../entities/servicio.entity';

interface SecServicioForm {
    id_sec?: string;
    titulo_sec: string;
    contenido_sec: string;
    image_file?: FileList;
    image_url?: string | null;
    image_alt?: string;
    image_position?: string;
}

interface ServicioFormFields {
    nombre_servicio: string;
    descripcion: string;
    valor: number;
    nombre_promocion: string;
    porcentaje_descuento: number;
    destacado: string;
    activo: boolean;
    img_alt: string;
    image_file?: FileList;
    sec_servicio: SecServicioForm[];
}

interface Props {
    editingServicio: ServicioEntity | null;
    servicios: ServicioEntity[];
    onUpdated: (servicios: ServicioEntity[]) => void;
    onClose: () => void;
}

export function ServicioForm({ editingServicio, servicios, onUpdated, onClose }: Props) {
    const [addSec, setAddSec] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ServicioFormFields>({
        defaultValues: editingServicio ? {
            nombre_servicio: editingServicio.nombre_servicio,
            descripcion: editingServicio.descripcion ?? '',
            valor: editingServicio.valor ?? 0,
            nombre_promocion: editingServicio.nombre_promocion ?? '',
            porcentaje_descuento: editingServicio.porcentaje_descuento ?? 0,
            destacado: editingServicio.destacado ? 'true' : 'false',
            activo: editingServicio.activo,
            img_alt: editingServicio.img_alt ?? '',
            sec_servicio: editingServicio.sec_servicio?.map(sec => ({
                id_sec: sec.id,
                titulo_sec: sec.titulo_sec ?? '',
                contenido_sec: sec.contenido_sec ?? '',
                image_url: sec.image_url ?? null,
                image_alt: sec.image_alt ?? '',
                image_position: sec.image_position ?? 'none',
            })) ?? [],
        } : {
            nombre_servicio: '',
            descripcion: '',
            valor: 0,
            nombre_promocion: '',
            porcentaje_descuento: 0,
            destacado: 'false',
            activo: true,
            img_alt: '',
            sec_servicio: [],
        },
    });

    const { fields: secFields, append: appendSec, remove: removeSec } = useFieldArray({
        control,
        name: 'sec_servicio',
    });

    const activo = watch('activo');
    const destacado = watch('destacado');

    const onSubmit = async (data: ServicioFormFields) => {
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
                sec_servicio: data.sec_servicio,
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
            onClose();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el servicio');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                    <h3 className="text-base font-semibold text-zinc-900">
                        {editingServicio ? 'Editar servicio' : 'Nuevo servicio'}
                    </h3>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
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
                                    minLength: { value: 1, message: 'Mínimo 1 caracter' },
                                    maxLength: { value: 200, message: 'Máximo 200 caracteres' },
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
                                type="number"
                                register={register}
                                rules={{ required: false }}
                            />
                        </div>
                        <div>
                            <Input
                                label="Nombre de promoción"
                                name="nombre_promocion"
                                register={register}
                                rules={{ required: false, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }}
                            />
                        </div>
                        <div>
                            <Input
                                label="Porcentaje de descuento"
                                name="porcentaje_descuento"
                                type="number"
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
                                rules={{ required: false, maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
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
                            onClick={() => setValue('activo', !activo)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${activo === true ? 'bg-blue-600' : 'bg-zinc-300'}`}
                            aria-label="Activar o desactivar servicio"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${activo === true ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    {/* Secciones del servicio */}
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
                                        name={`sec_servicio.${index}.titulo_sec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }}
                                    />
                                    <TextAreaArt
                                        label="Contenido"
                                        name={`sec_servicio.${index}.contenido_sec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 5000, message: 'Máximo 5000 caracteres' } }}
                                    />
                                    {field.image_position !== 'none' && (
                                        <InputFile
                                            label="Imagen"
                                            name={`sec_servicio.${index}.image_file` as any}
                                            register={register}
                                            currentImageUrl={field.image_url}
                                        />
                                    )}
                                    {field.image_position !== 'none' && (
                                        <Input
                                            label="Texto alternativo de la imagen (alt)"
                                            name={`sec_servicio.${index}.image_alt` as any}
                                            register={register}
                                            rules={{ required: false, maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
                                        />
                                    )}
                                    <input type="hidden" {...register(`sec_servicio.${index}.image_position` as any)} />
                                    <input type="hidden" {...register(`sec_servicio.${index}.id_sec` as any)} />
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
                            {isSubmitting ? 'Guardando...' : editingServicio ? 'Guardar cambios' : 'Crear servicio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
