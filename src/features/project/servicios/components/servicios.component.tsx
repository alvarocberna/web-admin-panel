'use client'
import { useState, useEffect } from 'react';
import { ProyectoServiciosService } from '../services/servicios.service';
import { ProyectoServiciosEntity } from '../entities/servicios.entity';
import { ContenedorSec } from '@/shared/project';

export function ProyectoServicios() {
    const [servicios, setServicios] = useState<ProyectoServiciosEntity | null>(null);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const data = await ProyectoServiciosService.getServicios();
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
                servicios.activo ?
        <ContenedorSec>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-zinc-800">{servicios.activo}</h2>
                {servicios.descripcion && (
                    <p className="text-sm text-zinc-500 mt-1">{servicios.descripcion}</p>
                )}
            </div>

            {servicios.servicio && servicios.servicio.length > 0 ? (
                <div className="flex flex-wrap -mx-2">
                    {servicios.servicio.map(srv => (
                        <div key={srv.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                            <div className="card px-5 py-5 h-full flex flex-col">
                                {srv.img_url && (
                                    <img
                                        src={srv.img_url}
                                        alt={srv.img_alt}
                                        className="w-full h-40 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <div className="flex items-start justify-between mb-2">
                                    <p className="text-sm font-semibold text-zinc-900">{srv.nombre_servicio}</p>
                                    {srv.destacado && (
                                        <span className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                            Destacado
                                        </span>
                                    )}
                                </div>
                                {srv.descripcion && (
                                    <p className="text-xs text-zinc-600 line-clamp-3 mb-3">{srv.descripcion}</p>
                                )}
                                {srv.valor && (
                                    <p className="text-sm font-medium text-zinc-800 mt-auto">{srv.valor}</p>
                                )}
                                {srv.nombre_promocion && (
                                    <p className="text-xs text-zinc-500">{srv.nombre_promocion}
                                        {srv.porcentaje_descuento ? ` — ${srv.porcentaje_descuento}% off` : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card py-10 text-center text-zinc-400 text-sm">
                    No hay servicios disponibles.
                </div>
            )}
        </ContenedorSec>
        :
        <div></div>
        }
        </div>
    );
}
