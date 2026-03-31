'use client'
import { useState, useEffect } from 'react';
import { ContenedorAdmin, TitleSec } from '@/shared';
import { EquipoService, EquipoEntity, EmpleadoEntity, EquipoForm, ListaEmpleados } from '@/features';

export default function EquipoPage() {
    const [equipo, setEquipo] = useState<EquipoEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const data = await EquipoService.getEquipo();
                setEquipo(data);
            } catch (error) {
                console.error('Error obteniendo equipo:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipo();
    }, []);

    const handleEquipoSaved = (e: EquipoEntity) => {
        setEquipo(e);
    };

    const handleEmpleadosUpdated = (empleados: EmpleadoEntity[]) => {
        if (!equipo) return;
        setEquipo({ ...equipo, empleado: empleados });
    };

    return (
        <ContenedorAdmin>
            <TitleSec title="Equipo" />

            {loading ? (
                <div className="py-16 text-center text-zinc-400 text-sm">Cargando...</div>
            ) : (
                <div className="mt-4">
                    <EquipoForm equipo={equipo} onSaved={handleEquipoSaved} />

                    {equipo && (
                        <ListaEmpleados
                            empleados={equipo.empleado ?? []}
                            onUpdated={handleEmpleadosUpdated}
                        />
                    )}
                </div>
            )}
        </ContenedorAdmin>
    );
}
