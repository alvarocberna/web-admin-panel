'use client'
import { useState, useEffect } from 'react';
import { ProyectoEquipoService } from '../services/equipo.service';
import { ProyectoEquipoEntity } from '../entities/equipo.entity';
import { ContenedorSec } from '@/shared/project';

export function ProyectoEquipo() {
    const [equipo, setEquipo] = useState<ProyectoEquipoEntity | null>(null);

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
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-zinc-800">{equipo.titulo}</h2>
                {equipo.descripcion && (
                    <p className="text-sm text-zinc-500 mt-1">{equipo.descripcion}</p>
                )}
            </div>

            {equipo.empleado && equipo.empleado.length > 0 ? (
                <div className="flex flex-wrap -mx-2">
                    {equipo.empleado.map(emp => (
                        <div key={emp.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                            <div className="card px-5 py-5 h-full flex flex-col">
                                {emp.img_url && (
                                    <img
                                        src={emp.img_url}
                                        alt={emp.img_alt}
                                        className="w-16 h-16 rounded-full object-cover mb-3"
                                    />
                                )}
                                <p className="text-sm font-semibold text-zinc-900">
                                    {emp.nombre_primero}
                                    {emp.nombre_segundo ? ` ${emp.nombre_segundo}` : ''}{' '}
                                    {emp.apellido_paterno}
                                    {emp.apellido_materno ? ` ${emp.apellido_materno}` : ''}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">{emp.profesion}</p>
                                {emp.especialidad && (
                                    <p className="text-xs text-zinc-400">{emp.especialidad}</p>
                                )}
                                {emp.descripcion && (
                                    <p className="text-xs text-zinc-600 mt-2 line-clamp-3">{emp.descripcion}</p>
                                )}
                            </div>
                        </div>
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
