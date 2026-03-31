'use client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { TestimoniosService } from '../services/testimonios.service';
import { ContenedorSec } from '@/shared/project'

interface TestimonioForm {
    nombre: string;
    apellido: string;
    correo: string;
    descripcion: string;
    calificacion: number | null;
}

export function NuevoTestimonio({ sinContenedor }: { sinContenedor?: boolean } = {}) {
    const [calificacion, setCalificacion] = useState<number | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const [enviado, setEnviado] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TestimonioForm>();

    const onSubmit: SubmitHandler<TestimonioForm> = async (data) => {
        try {
            await TestimoniosService.createTestimonio({
                ...data,
                calificacion,
                status: 'pending',
            });
            toast.success('¡Gracias por tu testimonio!');
            reset();
            setCalificacion(null);
            setEnviado(true);
        } catch (error: any) {
            toast.error(error.message || 'Error al enviar el testimonio');
        }
    };

    if (enviado) {
        return (
            <div className="card px-6 py-10 text-center">
                <p className="text-lg font-semibold text-zinc-800 mb-2">¡Testimonio enviado!</p>
                <p className="text-sm text-zinc-500">Tu opinión será revisada antes de publicarse.</p>
                <button
                    type="button"
                    onClick={() => setEnviado(false)}
                    className="mt-5 btn btn-outline text-sm"
                >
                    Escribir otro testimonio
                </button>
            </div>
        );
    }

    const form = (
        <form onSubmit={handleSubmit(onSubmit)} className="card px-6 py-6 space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">Escribe tu testimonio</h3>

            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre</label>
                    <input
                        type="text"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 outline-none focus:border-blue-400 transition-colors"
                        placeholder="Tu nombre"
                        {...register('nombre', {
                            required: 'Nombre requerido',
                            maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                        })}
                    />
                    {errors.nombre && <span className="text-red-500 text-xs mt-1 block">{errors.nombre.message}</span>}
                </div>

                <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Apellido</label>
                    <input
                        type="text"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 outline-none focus:border-blue-400 transition-colors"
                        placeholder="Tu apellido"
                        {...register('apellido', {
                            required: 'Apellido requerido',
                            maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                        })}
                    />
                    {errors.apellido && <span className="text-red-500 text-xs mt-1 block">{errors.apellido.message}</span>}
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Correo electrónico</label>
                <input
                    type="email"
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 outline-none focus:border-blue-400 transition-colors"
                    placeholder="tu@correo.com"
                    {...register('correo', {
                        required: 'Correo requerido',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
                    })}
                />
                {errors.correo && <span className="text-red-500 text-xs mt-1 block">{errors.correo.message}</span>}
            </div>

            <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Testimonio</label>
                <textarea
                    rows={4}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="Comparte tu experiencia..."
                    {...register('descripcion', {
                        required: 'El testimonio es requerido',
                        minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                        maxLength: { value: 1000, message: 'Máximo 1000 caracteres' },
                    })}
                />
                {errors.descripcion && <span className="text-red-500 text-xs mt-1 block">{errors.descripcion.message}</span>}
            </div>

            <div>
                <label className="block text-xs font-medium text-zinc-600 mb-2">Calificación</label>
                <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const valor = i + 1;
                        const activa = (hovered ?? calificacion ?? 0) >= valor;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCalificacion(valor)}
                                onMouseEnter={() => setHovered(valor)}
                                onMouseLeave={() => setHovered(null)}
                                className="p-0.5 focus:outline-none"
                                aria-label={`${valor} estrella${valor > 1 ? 's' : ''}`}
                            >
                                <FontAwesomeIcon
                                    icon={faStar}
                                    style={{ width: '20px', height: '20px' }}
                                    className={activa ? 'text-yellow-400' : 'text-zinc-200'}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
            >
                {isSubmitting ? 'Enviando...' : 'Enviar testimonio'}
            </button>
        </form>
    );

    return sinContenedor ? form : <ContenedorSec>{form}</ContenedorSec>;
}
