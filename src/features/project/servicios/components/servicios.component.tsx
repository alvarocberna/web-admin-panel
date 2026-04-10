'use client'
//REACT
import { useState, useEffect } from 'react';
//FEATURES
import { ServiciosEntity, ServiciosService, ServicioCard } from '@/features/project';
//SHARED
import { ContenedorSec } from '@/shared/project';

export function ServiciosPublic() {
    const [servicios, setServicios] = useState<ServiciosEntity | null>(null);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const data = await ServiciosService.getServicios();
                setServicios(data);
            } catch (error) {
                console.error('Error obteniendo servicios:', error);
            }
        };
        fetchServicios();
    }, []);

    if (!servicios) return null;

    return (
        <div>
            {
                servicios.activo &&
                <ContenedorSec>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-texto mb-4">
                            {servicios.titulo}
                        </h2>
                        <p className="text-gris text-lg max-w-xl mx-auto">
                            {servicios.descripcion}
                        </p>
                    </div>
                    {servicios.servicio && servicios.servicio.length > 0 ? (
                        <div className="flex flex-wrap -mx-2">
                            {servicios.servicio.filter(srv => srv.activo).map(srv => (
                               <ServicioCard {...srv}/>
                            ))}
                        </div>
                    ) : (
                        <div className="card py-10 text-center text-zinc-400 text-sm">
                            No hay servicios disponibles.
                        </div>
                    )}
                </ContenedorSec>
        }
        </div>
    );
}
