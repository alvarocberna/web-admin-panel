'use client'
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
//FEATURES
import { TestimonioEntity } from '@/features/project';

interface TestimonioCardProps {
    testimonio: TestimonioEntity;
}

export function TestimonioCard({ testimonio }: TestimonioCardProps) {
    const fecha = new Date(testimonio.fecha_creacion);

    return (
        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <p className="text-md font-semibold text-zinc-900">{testimonio.nombre} {testimonio.apellido}</p>
                    </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            style={{ width: '12px', height: '12px' }}
                            className={i < testimonio.calificacion ? 'text-yellow-400' : 'text-zinc-200'}
                        />
                    ))}
                </div>

                <p className="text-sm text-zinc-700 flex-1 line-clamp-3">
                    {testimonio.descripcion}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                    <p className="text-xs text-zinc-500">
                        {fecha.toLocaleDateString('es-ES')}
                    </p>
                </div>
            </div>
        </div>
    );
}
