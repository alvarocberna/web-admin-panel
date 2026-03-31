'use client'
import { useState, useEffect } from 'react';
import { EquipoEntity, ProyectoEquipoService, CardEmpleado, Card2Empleado } from '@/features/project';
import { ContenedorSec } from '@/shared/project';

export function EquipoPublic() {
    const [equipo, setEquipo] = useState<EquipoEntity | null>(null);

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const data = await ProyectoEquipoService.getEquipo();
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
                    <div className="">
                        <h2 className="text-2xl font-semibold mb-4 text-zinc-900">{equipo.titulo}</h2>
                        {equipo.descripcion && (
                            <p className="text-md text-zinc-700 mb-4">{equipo.descripcion}</p>
                        )}
                    </div>

                    {equipo.empleado && equipo.empleado.length > 0 ? (
                        <div className="flex flex-wrap -mx-2">
                            {equipo.empleado.filter(emp => emp.activo).map(emp => (
                                //CARD EMPLEADO
                                <Card2Empleado {...emp} />
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
