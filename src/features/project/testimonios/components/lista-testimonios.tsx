'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { TestimoniosService } from '@/features/project';
import { TestimonioEntity, TestimoniosEntity } from '@/features/project';
import { ContenedorSec } from '@/shared/project';

export function ListaTestimonios() {
    const [testimonios, setTestimonios] = useState<TestimoniosEntity>();

    useEffect(() => {
        const fetchTestimonios = async () => {
            try {
                const data = await TestimoniosService.getTestimonios();
                if(!data){
                    return "data no encontrada"
                }
                setTestimonios(data);
            } catch (error) {
                console.error('Error obteniendo testimonios:', error);
            }
        };
        fetchTestimonios();
    }, []);

    return (
        <div>
            {
                testimonios?.activo &&
        <ContenedorSec>
            <h3 className="text-2xl font-semibold text-zinc-900 mb-4">
                {testimonios?.titulo}
            </h3>
            {
                testimonios.descripcion &&
                <p className='text-md text-zinc-700 mb-4'>
                    {testimonios?.descripcion}
                </p>
            }

            {testimonios?.testimonio.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay testimonios registrados.
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2">
                    {testimonios?.testimonio.map(t => {
                        const fecha = new Date(t.fecha_creacion);
                        return (
                            <div key={t.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                                <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-md font-semibold text-zinc-900">{t.nombre} {t.apellido}</p>
                                            <p className="text-xs text-zinc-400">{t.correo}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.aprobado ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                            {t.aprobado ? 'Aprobado' : 'Pendiente'}
                                        </span>
                                    </div>

                                    <div className="flex gap-0.5 mb-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <FontAwesomeIcon
                                                key={i}
                                                icon={faStar}
                                                style={{ width: '12px', height: '12px' }}
                                                className={i < t.calificacion ? 'text-yellow-400' : 'text-zinc-200'}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-xs text-zinc-600 flex-1 line-clamp-3">{t.descripcion}</p>

                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                                        <p className="text-xs text-zinc-400">
                                            {fecha.toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </ContenedorSec>
                   }
        </div>
    );
}
