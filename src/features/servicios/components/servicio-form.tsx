'use client'
//REACT
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
//NEXT
import Image from 'next/image';
//SHARED
import { Input, TextAreaArt, InputFile } from '@/shared';
//FEATURES
import {ServiciosService, ServicioEntity} from '@/features'


const ALL_SOLID_ICONS: IconDefinition[] = Object.values(solidIcons).filter(
    (v): v is IconDefinition =>
        !!v && typeof v === 'object' && 'iconName' in v && 'icon' in v,
);

interface SecServicioForm {
    idSec?: string;
    tituloSec: string;
    contenidoSec: string;
    imageFile?: FileList;
    imageUrl?: string | null;
    imageAlt?: string;
    imagePosition?: string;
}

interface ServicioFormFields {
    nombreServicio: string;
    descripcion: string;
    valor: number;
    nombrePromocion: string;
    porcentajeDescuento: number;
    destacado: string;
    activo: boolean;
    icono: string;
    imgAlt: string;
    imageFile?: FileList;
    secServicio: SecServicioForm[];
}

interface Props {
    editingServicio: ServicioEntity | null;
    onSaved: (saved: ServicioEntity, wasEditing: boolean) => void;
    onClose: () => void;
}


export function ServicioForm({ editingServicio, onSaved, onClose }: Props) {
    const [addSec, setAddSec] = useState(true);
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [iconSearch, setIconSearch] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ServicioFormFields>({
        defaultValues: editingServicio ? {
            nombreServicio: editingServicio.nombreServicio,
            descripcion: editingServicio.descripcion ?? '',
            valor: editingServicio.valor ?? 0,
            nombrePromocion: editingServicio.nombrePromocion ?? '',
            porcentajeDescuento: editingServicio.porcentajeDescuento ?? 0,
            destacado: editingServicio.destacado ? 'true' : 'false',
            activo: editingServicio.activo,
            icono: editingServicio.icono ?? '',
            imgAlt: editingServicio.imgAlt ?? '',
            secServicio: editingServicio.secServicio?.map(sec => ({
                idSec: sec.id,
                tituloSec: sec.tituloSec ?? '',
                contenidoSec: sec.contenidoSec ?? '',
                imageUrl: sec.imageUrl ?? null,
                imageAlt: sec.imageAlt ?? '',
                imagePosition: sec.imagePosition ?? 'none',
            })) ?? [],
        } : {
            nombreServicio: '',
            descripcion: '',
            valor: 0,
            nombrePromocion: '',
            porcentajeDescuento: 0,
            destacado: 'false',
            activo: true,
            icono: '',
            imgAlt: '',
            secServicio: [],
        },
    });

    const { fields: secFields, append: appendSec, remove: removeSec } = useFieldArray({
        control,
        name: 'secServicio',
    });

    const activo = watch('activo');
    const destacado = watch('destacado');
    const icono = watch('icono');

    const onSubmit = async (data: ServicioFormFields) => {
        try {
            const payload = {
                nombreServicio: data.nombreServicio,
                descripcion: data.descripcion || null,
                valor: data.valor || null,
                nombrePromocion: data.nombrePromocion || null,
                porcentajeDescuento: data.porcentajeDescuento || null,
                destacado: data.destacado === 'true',
                icono: data.icono || null,
                orden: null,
                activo: data.activo,
                imgUrl: editingServicio?.imgUrl ?? null,
                imgAlt: data.imgAlt || null,
                imageFile: data.imageFile,
                secServicio: data.secServicio,
            };

            if (editingServicio) {
                const actualizado = await ServiciosService.updateServicio(editingServicio.id, payload);
                onSaved(actualizado, true);
                toast.success('Servicio actualizado correctamente');
            } else {
                const nuevo = await ServiciosService.createServicio(payload);
                onSaved(nuevo, false);
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
                                name="nombreServicio"
                                register={register}
                                rules={{
                                    required: 'El nombre del servicio es requerido',
                                    minLength: { value: 1, message: 'Mínimo 1 caracter' },
                                    maxLength: { value: 200, message: 'Máximo 200 caracteres' },
                                }}
                            />
                            {errors.nombreServicio && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombreServicio.message}</p>
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
                                name="nombrePromocion"
                                register={register}
                                rules={{ required: false, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }}
                            />
                        </div>
                        <div>
                            <Input
                                label="Porcentaje de descuento"
                                name="porcentajeDescuento"
                                type="number"
                                register={register}
                                rules={{ required: false }}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <InputFile
                                label="Imagen del servicio"
                                name="imageFile"
                                register={register}
                                currentImageUrl={editingServicio?.imgUrl}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Input
                                label="Texto alternativo de la imagen (alt)"
                                name="imgAlt"
                                register={register}
                                rules={{ required: false, maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
                            />
                        </div>

                        {/* Selector de icono */}
                        <div className="sm:col-span-2 mt-1">
                            <p className="text-sm font-medium text-zinc-700 mb-1.5">Icono</p>
                            <div className="flex items-center gap-2">
                                {icono && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg min-w-0">
                                        <FontAwesomeIcon
                                            icon={ALL_SOLID_ICONS.find(ic => ic.iconName === icono)!}
                                            style={{ width: '14px', height: '14px' }}
                                            className="text-blue-600 shrink-0"
                                        />
                                        <span className="text-sm text-blue-700 font-medium truncate">{icono}</span>
                                        <button
                                            type="button"
                                            onClick={() => { setValue('icono', ''); setIconPickerOpen(false); }}
                                            className="text-blue-400 hover:text-blue-700 transition-colors shrink-0 ml-1"
                                            title="Quitar icono"
                                        >
                                            <FontAwesomeIcon icon={faXmark} style={{ width: '11px', height: '11px' }} />
                                        </button>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIconPickerOpen(o => !o)}
                                    className="text-sm text-zinc-600 hover:text-blue-600 border border-zinc-200 hover:border-blue-400 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                                >
                                    {icono ? 'Cambiar icono' : 'Seleccionar icono'}
                                </button>
                            </div>
                            {iconPickerOpen && (
                                <div className="mt-2 border border-zinc-200 rounded-xl p-3 bg-white shadow-sm">
                                    <input
                                        type="text"
                                        placeholder="Buscar icono..."
                                        value={iconSearch}
                                        onChange={e => setIconSearch(e.target.value.toLowerCase())}
                                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                        autoFocus
                                    />
                                    <div className="overflow-y-auto max-h-48">
                                        <div className="grid grid-cols-8 gap-1">
                                            {ALL_SOLID_ICONS
                                                .filter(ic => ic.iconName.includes(iconSearch))
                                                .slice(0, 64)
                                                .map(ic => (
                                                    <button
                                                        key={ic.iconName}
                                                        type="button"
                                                        title={ic.iconName}
                                                        onClick={() => {
                                                            setValue('icono', ic.iconName);
                                                            setIconPickerOpen(false);
                                                            setIconSearch('');
                                                        }}
                                                        className={`flex items-center justify-center w-full aspect-square rounded-lg transition-colors duration-150 ${
                                                            icono === ic.iconName
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-zinc-50 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon icon={ic} style={{ width: '14px', height: '14px' }} />
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <input type="hidden" {...register('icono')} />
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
                                        name={`secServicio.${index}.tituloSec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }}
                                    />
                                    <TextAreaArt
                                        label="Contenido"
                                        name={`secServicio.${index}.contenidoSec` as any}
                                        register={register}
                                        rules={{ required: false, maxLength: { value: 5000, message: 'Máximo 5000 caracteres' } }}
                                    />
                                    {field.imagePosition !== 'none' && (
                                        <InputFile
                                            label="Imagen"
                                            name={`secServicio.${index}.imageFile` as any}
                                            register={register}
                                            currentImageUrl={field.imageUrl}
                                        />
                                    )}
                                    {field.imagePosition !== 'none' && (
                                        <Input
                                            label="Texto alternativo de la imagen (alt)"
                                            name={`secServicio.${index}.imageAlt` as any}
                                            register={register}
                                            rules={{ required: false, maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
                                        />
                                    )}
                                    <input type="hidden" {...register(`secServicio.${index}.imagePosition` as any)} />
                                    <input type="hidden" {...register(`secServicio.${index}.idSec` as any)} />
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
                            {isSubmitting ? 'Guardando...' : editingServicio ? 'Guardar cambios' : 'Crear servicio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
