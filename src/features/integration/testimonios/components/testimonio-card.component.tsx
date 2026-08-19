'use client'
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
//FEATURES
import { TestimonioEntityPublic } from '@/features';

interface TestimonioCardProps {
    testimonio: TestimonioEntityPublic;
}

export function TestimonioCardPublic({ testimonio }: TestimonioCardProps) {
    const fecha = new Date(testimonio.fechaCreacion);

    return (
        // <div className=" px-2 mb-4" style={{border: '1px solid red'}}>
            <div className="card px-5 py-5 h-full flex flex-col hover-btn">
                <div className="flex items-center justify-start  mb-2">
                    <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-texto-invertido text-sm font-bold me-2"
                    style={{ background: 'var(--color-lila)' }}
                    >
                        {testimonio.nombre[0]}{testimonio.apellido[0]}
                    </div>
                    <div>
                        <p className="text-md font-semibold text-texto">{testimonio.nombre} {testimonio.apellido}</p>
                    </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            style={{ width: '12px', height: '12px' }}
                            className={i < testimonio.calificacion ? 'text-rating' : 'text-gris-claro'}
                        />
                    ))}
                </div>

                <p className="text-sm text-gris-oscuro flex-1 line-clamp-3">
                    {testimonio.descripcion}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gris-claro">
                    <p className="text-xs text-gris-suave">
                        {fecha.toLocaleDateString('es-ES')}
                    </p>
                </div>
            </div>
        // </div>
    );
}

