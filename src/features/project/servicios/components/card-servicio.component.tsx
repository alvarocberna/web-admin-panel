'use client'
import Link from 'next/link';
import { ServicioEntity } from "../entities/servicio.entity"

export function CardServicio(srv: ServicioEntity){
    return(
         <div key={srv.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <Link href={`/project/servicios/${srv.slug}`} className="card h-full flex flex-col hover-btn overflow-hidden">
                {srv.img_url && (
                    <img
                        src={srv.img_url}
                        alt={srv.img_alt}
                        style={{borderRadius: '12px 12px 0px 0px'}}
                        className="w-full h-48 object-cover"
                    />
                )}
                {/* TEXTO */}
                <div className="px-4 py-3">
                    <div className="flex items-start justify-between mb-2">
                        <p className="text-md font-semibold text-zinc-900">{srv.nombre_servicio}</p>
                        {srv.destacado && (
                            <span className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
                                Destacado
                            </span>
                        )}
                    </div>
                    {srv.valor && (
                        <p className="text-sm font-medium text-zinc-900 mt-auto">{srv.valor}</p>
                    )}
                    {srv.nombre_promocion && (
                        <p className="text-sm text-zinc-900">{srv.nombre_promocion}
                            {srv.porcentaje_descuento ? ` — ${srv.porcentaje_descuento}% off` : ''}
                        </p>
                    )}
                    {srv.descripcion && (
                        <p className="text-sm text-zinc-700 line-clamp-3 mb-3">{srv.descripcion}</p>
                    )}
                </div>
            </Link>
        </div>
    )

}
