'use client'
//REACT
import { useState, useEffect } from 'react';
//FEATURES
import { EquipoEntity, EquipoService, EmpleadoCard } from '@/features/project';
//SHARED
import { ContenedorSec } from '@/shared/project';

export function EquipoPublic() {
    const [equipo, setEquipo] = useState<EquipoEntity | null>(null);

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const data = await EquipoService.getEquipo();
                setEquipo(data);
            } catch (error) {
                console.error('Error obteniendo equipo:', error);
            }
        };
        fetchEquipo();
    }, []);

    if (!equipo) return null;

    return (
        <div>
            {
                equipo.activo ?
                <ContenedorSec>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-texto mb-4">
                            {equipo.titulo}
                        </h2>
                        <p className="text-gris text-lg max-w-xl mx-auto">
                            {equipo.descripcion}
                        </p>
                    </div>

                    {equipo.empleado && equipo.empleado.length > 0 ? (
                        <div className="flex flex-wrap -mx-2">
                            {equipo.empleado.filter(emp => emp.activo).map(emp => (
                                //CARD EMPLEADO
                                <EmpleadoCard {...emp} />
                            ))}
                        </div>
                    ) : (
                        <div className="card py-10 text-center text-zinc-400 text-sm">
                            No hay miembros en el equipo.
                        </div>
                    )}
                </ContenedorSec>
                :
                <div></div>
            }
        </div>
    );
}
