'use client'
//NEXT
import { useRouter } from 'next/navigation';
//REACT
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
//SHARED
import { Input, TextAreaArt, stripTags } from '@/shared';
//FEATURES
import { ArticulosService, ArticulosEntity } from '@/features';

interface ArticulosForm {
    titulo: string;
    descripcion: string;
    activo: boolean;
    aprobar: boolean;
}

interface Props {
    articulos: ArticulosEntity | null;
    rol?: string;
}

export function ArticulosForm({ articulos, rol }: Props) {
    const router = useRouter();

    if (rol !== 'ADMIN' && rol !== 'SUPERADMIN') return null;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ArticulosForm>({
        defaultValues: { titulo: '', descripcion: '', activo: true, aprobar: false },
    });

    const activo = watch('activo');
    const aprobar = watch('aprobar');

    useEffect(() => {
        if (articulos) {
            reset({
                titulo: articulos.titulo,
                descripcion: articulos.descripcion ?? '',
                activo: articulos.activo,
                aprobar: articulos.aprobar,
            });
        }
    }, [articulos, reset]);

    const onSubmit = async (data: ArticulosForm) => {
        try {
            if (articulos) {
                await ArticulosService.updateArticulos({
                    titulo: stripTags(data.titulo),
                    descripcion: stripTags(data.descripcion),
                    activo: data.activo,
                    aprobar: data.aprobar,
                    notificacion: false,
                    habilitado: true,
                });
                toast.success('Sección de artículos actualizada correctamente');
            } else {
                await ArticulosService.createArticulos({
                    titulo: stripTags(data.titulo),
                    descripcion: stripTags(data.descripcion),
                    activo: data.activo,
                    aprobar: data.aprobar,
                    notificacion: false,
                    habilitado: true,
                });
                toast.success('Sección de artículos creada correctamente');
            }
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar la sección de artículos');
        }
    };

    return (
        <div className="card px-6 py-6 max-w-lg">
            <h2 className=" text-md font-semibold text-zinc-900 mb-1">
                {articulos ? 'Editar sección de artículos' : 'Crear sección de artículos'}
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
                {articulos
                    ? 'Actualiza el título y descripción de la sección.'
                    : 'Configura la sección de artículos de tu proyecto.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                    label="Título"
                    name="titulo"
                    register={register}
                    rules={{ required: 'El título es requerido', minLength: {value: 1, message: 'Mínimo 1 caracter'}, maxLength: {value: 200, message: 'Máximo 200 caracteres'}}}
                />
                {errors.titulo && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.titulo.message}</p>
                )}

                <TextAreaArt
                    label="Descripción"
                    name="descripcion"
                    register={register}
                    rules={{ required: false, maxLength: {value: 500, message: 'Máximo 500 caracteres'} }}
                />
                {errors.descripcion && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.descripcion.message}</p>
                )}

                <div className="flex items-center justify-between mt-4 py-3 border-t border-zinc-100">
                    <div>
                        <p className="text-sm font-medium text-zinc-800">Sección activa</p>
                        <p className="text-xs text-zinc-400">Muestra u oculta esta sección en el sitio web.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setValue('activo', !activo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${activo ? 'bg-blue-600' : 'bg-zinc-300'}`}
                        aria-label="Activar o desactivar sección"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${activo ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-zinc-100">
                    <div>
                        <p className="text-sm font-medium text-zinc-800">Aprobar</p>
                        <p className="text-xs text-zinc-400">Artículos escritos por otros usuarios requieren aprobación.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setValue('aprobar', !aprobar)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${aprobar ? 'bg-green-600' : 'bg-zinc-300'}`}
                        aria-label="Aprobar o desaprobar artículo"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${aprobar ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="mt-5 flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : articulos ? 'Guardar cambios' : 'Crear sección'}
                    </button>
                </div>
            </form>
        </div>
    );
}
