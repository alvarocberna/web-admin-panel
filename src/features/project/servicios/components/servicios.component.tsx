'use client'
import { useState, useEffect } from 'react';
import { ServiciosEntity, ServiciosService, CardServicio, Card2Servicio } from '@/features/project';
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
                    <div className="">
                        <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
                            {servicios.titulo}
                        </h2>
                        {servicios.descripcion && (
                            <p className="text-md text-zinc-700 mb-4">{servicios.descripcion}</p>
                        )}
                    </div>
                    {servicios.servicio && servicios.servicio.length > 0 ? (
                        <div className="flex flex-wrap -mx-2">
                            {servicios.servicio.filter(srv => srv.activo).map(srv => (
                               <CardServicio {...srv}/>
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
