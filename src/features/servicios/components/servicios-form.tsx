'use client'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input, TextAreaArt, stripTags } from '@/shared';
import { ServiciosService } from '../services/servicios.service';
import { ServiciosEntity } from '../entities/servicios.entity';

interface ServiciosForm {
    titulo: string;
    descripcion: string;
    icono: string;
    activo: boolean;
}

interface Props {
    servicios: ServiciosEntity | null;
    onSaved: (s: ServiciosEntity) => void;
}

export function ServiciosForm({ servicios, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ServiciosForm>({
        defaultValues: { titulo: '', descripcion: '', icono: '', activo: true },
    });

    const activo = watch('activo');

    useEffect(() => {
        if (servicios) {
            reset({
                titulo: servicios.titulo,
                descripcion: servicios.descripcion ?? '',
                // icono: servicios.icono ?? '',
                activo: servicios.activo,
            });
        }
    }, [servicios, reset]);

    const onSubmit = async (data: ServiciosForm) => {
        try {
            const payload = {
                titulo: stripTags(data.titulo),
                descripcion: stripTags(data.descripcion),
                icono: 'x',
                activo: data.activo,
                notificacion: false,
                habilitado: true,
            };
            let resultado: ServiciosEntity;
            if (servicios) {
                resultado = await ServiciosService.updateServicios(payload);
                toast.success('Sección de servicios actualizada correctamente');
            } else {
                resultado = await ServiciosService.createServicios(payload);
                toast.success('Sección de servicios creada correctamente');
            }
            onSaved(resultado);
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar la sección de servicios');
        }
    };

    return (
        <div className="card px-6 py-6 max-w-lg">
            <h2 className="text-md font-semibold text-zinc-900 mb-1">
                {servicios ? 'Editar sección de servicios' : 'Crear sección de servicios'}
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
                {servicios
                    ? 'Actualiza el título, descripción e icono de la sección.'
                    : 'Configura la sección de servicios de tu proyecto.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

                <TextAreaArt
                    label="Descripción"
                    name="descripcion"
                    register={register}
                    rules={{ 
                        required: false,
                        maxLength: {value: 500, message: 'Máximo 500 caracteres'} 
                    }}
                />

                {/* <Input
                    label="Icono"
                    name="icono"
                    register={register}
                    rules={{ required: false }}
                /> */}

                <div className="flex items-center justify-between mt-4 py-3 border-t border-zinc-100">
                    <div>
                        <p className="text-sm font-medium text-zinc-800">Sección activa</p>
                        <p className="text-xs text-zinc-400">Muestra u oculta esta sección en el sitio web.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setValue('activo', activo === true ? false : true)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${activo === true ? 'bg-blue-600' : 'bg-zinc-300'}`}
                        aria-label="Activar o desactivar sección"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${activo === true ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="mt-5 flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : servicios ? 'Guardar cambios' : 'Crear sección'}
                    </button>
                </div>
            </form>
        </div>
    );
}
