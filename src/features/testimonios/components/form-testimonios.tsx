'use client'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input, TextAreaArt, stripTags } from '@/shared';
import { TestimoniosService } from '../services/testimonios.service';
import { TestimoniosEntity } from '../entities/testimonios.entity';

interface TestimoniosForm {
    titulo: string;
    descripcion: string;
    activo: boolean;
    aprobar: boolean;
}

interface Props {
    testimonios: TestimoniosEntity | null;
    onSaved: (t: TestimoniosEntity) => void;
}

export function FormTestimonios({ testimonios, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TestimoniosForm>({
        defaultValues: { titulo: '', descripcion: '', activo: true, aprobar: false },
    });

    const activo = watch('activo');
    const aprobar = watch('aprobar');

    useEffect(() => {
        if (testimonios) {
            reset({
                titulo: testimonios.titulo,
                descripcion: testimonios.descripcion,
                activo: testimonios.activo,
                aprobar: testimonios.aprobar,
            });
        }
    }, [testimonios, reset]);

    const onSubmit = async (data: TestimoniosForm) => {
        try {
            const payload = {
                titulo: stripTags(data.titulo),
                descripcion: stripTags(data.descripcion),
                activo: data.activo,
                aprobar: data.aprobar,
                notificacion: false,
                habilitado: true,
            };
            let resultado: TestimoniosEntity;
            if (testimonios) {
                resultado = await TestimoniosService.updateTestimonios(payload);
                toast.success('Sección de testimonios actualizada correctamente');
            } else {
                resultado = await TestimoniosService.createTestimonios(payload);
                toast.success('Sección de testimonios creada correctamente');
            }
            onSaved(resultado);
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar la sección de testimonios');
        }
    };

    return (
        <div className="card px-6 py-6 max-w-lg">
            <h2 className="text-md font-semibold text-zinc-900 mb-1">
                {testimonios ? 'Editar sección de testimonios' : 'Crear sección de testimonios'}
            </h2>
            <p className="text-sm text-zinc-500 mb-5">
                {testimonios
                    ? 'Actualiza el título y descripción de la sección.'
                    : 'Configura la sección de testimonios de tu proyecto.'}
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

                {/* Toggle activo */}
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

                {/* Toggle aprobar */}
                <div className="flex items-center justify-between py-3 border-t border-zinc-100">
                    <div>
                        <p className="text-sm font-medium text-zinc-800">Aprobar</p>
                        <p className="text-xs text-zinc-400">Testimonios escritos por otros usuarios requieren aprobación.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setValue('aprobar', !aprobar)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${aprobar ? 'bg-green-600' : 'bg-zinc-300'}`}
                        aria-label="Aprobar o desaprobar testimonio"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${aprobar ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="mt-5 flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : testimonios ? 'Guardar cambios' : 'Crear sección'}
                    </button>
                </div>
            </form>
        </div>
    );
}
