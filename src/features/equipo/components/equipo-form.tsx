'use client'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input, TextAreaArt } from '@/shared';
import { EquipoService } from '../services/equipo.service';
import { EquipoEntity } from '../entities/equipo.entity';

interface EquipoForm {
    titulo: string;
    descripcion: string;
    activo: boolean;
}

interface Props {
    equipo: EquipoEntity | null;
    onSaved: (e: EquipoEntity) => void;
}

export function EquipoForm({ equipo, onSaved }: Props) {
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
            let resultado: EquipoEntity;
            if (equipo) {
                resultado = await EquipoService.updateEquipo({
                    titulo: data.titulo,
                    descripcion: data.descripcion || null,
                    activo: data.activo,
                });
                toast.success('Equipo actualizado correctamente');
            } else {
                resultado = await EquipoService.createEquipo({
                    titulo: data.titulo,
                    descripcion: data.descripcion || null,
                    activo: data.activo,
                });
                toast.success('Equipo creado correctamente');
            }
            onSaved(resultado);
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el equipo');
        }
    };

    return (
        <div className="card px-6 py-6 max-w-lg">
            <h2 className=" text-md font-semibold text-zinc-900 mb-1">
                {equipo ? 'Editar equipo' : 'Crear equipo'}
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
                {equipo
                    ? 'Actualiza el título y descripción del equipo.'
                    : 'Configura la sección de equipo de tu proyecto.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                    label="Título"
                    name="titulo"
                    register={register}
                    rules={{ required: 'El título es requerido' }}
                />
                {errors.titulo && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.titulo.message}</p>
                )}

                <TextAreaArt
                    label="Descripción"
                    name="descripcion"
                    register={register}
                    rules={{ required: false }}
                />

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

                <div className="mt-5 flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : equipo ? 'Guardar cambios' : 'Crear equipo'}
                    </button>
                </div>
            </form>
        </div>
    );
}
