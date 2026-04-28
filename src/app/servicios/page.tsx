'use client'
//REACT
import { useState, useEffect } from 'react';
//SHARED
import { ContenedorAdmin, TitleSec } from '@/shared';
//FEATURES
import { ServiciosService, ServiciosEntity, ServicioEntity, ServiciosForm, ServicioList } from '@/features';

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<ServiciosEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const data = await ServiciosService.getServicios();
                setServicios(data);
            } catch (error) {
                console.error('Error obteniendo servicios:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServicios();
    }, []);

    const handleServiciosSaved = (s: ServiciosEntity) => {
        setServicios(prev => ({ ...s, servicio: s.servicio?.length ? s.servicio : (prev?.servicio ?? []) }));
    };

    const handleServiciosUpdated = (lista: ServicioEntity[]) => {
        if (!servicios) return;
        setServicios({ ...servicios, servicio: lista });
    };

    return (
        <ContenedorAdmin>
            <TitleSec title="Servicios" />

            {loading ? (
                <div className="py-16 text-center text-zinc-400 text-sm">Cargando...</div>
            ) : (
                <div className="mt-4">
                    <ServiciosForm servicios={servicios} onSaved={handleServiciosSaved} />

                    {servicios && (
                        <ServicioList
                            serviciosId={servicios.id}
                            servicios={servicios.servicio ?? []}
                            onUpdated={handleServiciosUpdated}
                        />
                    )}
                </div>
            )}
        </ContenedorAdmin>
    );
}
