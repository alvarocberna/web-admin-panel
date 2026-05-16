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
import { EquipoService, EquipoEntity } from '@/features';


interface EquipoForm {
    titulo: string;
    descripcion: string;
    activo: boolean;
}

interface Props {
    equipo: EquipoEntity | null;
}


export function EquipoForm({ equipo }: Props) {
    const router = useRouter(); //router para que al enviar el form se refresh la page
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<EquipoForm>({
        defaultValues: { titulo: '', descripcion: '', activo: true },
    });

    const activo = watch('activo');

    //seteamos los datos de sus valores x defecto a los de la db
    useEffect(() => {
        if (equipo) {
            reset({
                titulo: equipo.titulo,
                descripcion: equipo.descripcion ?? '',
                activo: equipo.activo,
            });
        }
    }, [equipo, reset]);

    const onSubmit = async (data: EquipoForm) => {
        try {
            if (equipo) { //si ya hay datos para equipo, los actualizamos
                await EquipoService.updateEquipo({
                    titulo: stripTags(data.titulo),
                    descripcion: stripTags(data.descripcion),
                    activo: data.activo,
                    notificacion: false,
                    habilitado: true,
                });
                toast.success('Equipo actualizado correctamente');
            } else { //si no hay datos para equipo, los creamos
                await EquipoService.createEquipo({
                    titulo: stripTags(data.titulo),
                    descripcion: stripTags(data.descripcion) || null,
                    activo: data.activo,
                    notificacion: false,
                    habilitado: true,
                });
                toast.success('Equipo creado correctamente');
            }
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el equipo');
        }
    };

    return (
        <div className="card px-6 py-6 max-w-lg">

            {/* titulo form */}
            <h2 className=" text-md font-semibold text-zinc-900 mb-1">
                {equipo ? 'Editar equipo' : 'Crear equipo'}
            </h2>

            {/* descripcion form */}
            <p className="text-sm text-zinc-500 mb-5">
                {equipo
                    ? 'Actualiza el título y descripción del equipo.'
                    : 'Configura la sección de equipo de tu proyecto.'}
            </p>

            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* input titulo */}
                <Input
                    label="Título"
                    name="titulo"
                    register={register}
                    rules={{
                        required: 'El título es requerido',
                        minLength: {value: 1, message: 'Mínimo 1 caracter'},
                        maxLength: {value: 200, message: 'Máximo 200 caracteres'}
                    }}
                />
                {errors.titulo && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.titulo.message}</p>
                )}

                {/* input descripcion */}
                <TextAreaArt
                    label="Descripción"
                    name="descripcion"
                    register={register}
                    rules={{
                        required: false,
                        maxLength: {value: 500, message: 'Máximo 500 caracteres'}
                    }}
                />
                {errors.descripcion && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.descripcion.message}</p>
                )}

                {/* toggle seccion activa */}
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

                {/* boton guardar */}
                <div className="mt-5 flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : equipo ? 'Guardar cambios' : 'Crear equipo'}
                    </button>
                </div>
            </form>

        </div>
    );
}
