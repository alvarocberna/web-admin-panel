'use client'
import { useState } from 'react';
import { ContenedorAdmin, TitleSec } from '@/shared';
import { ProyectoEntity } from '@/features/proyectos/entities/proyecto.entity';
import { ListaProyectos } from '@/features/proyectos/components/lista-proyectos';
import { DetalleProyecto } from '@/features/proyectos/components/detalle-proyecto';

export default function SuperAdminPage() {
    const [selectedProyecto, setSelectedProyecto] = useState<ProyectoEntity | null>(null);

    return (
        <ContenedorAdmin>
            {selectedProyecto ? (
                <DetalleProyecto
                    proyecto={selectedProyecto}
                    onBack={() => setSelectedProyecto(null)}
                />
            ) : (
                <>
                    <TitleSec title="Superadmin" />
                    <ListaProyectos onSelectProyecto={setSelectedProyecto} />
                </>
            )}
        </ContenedorAdmin>
    );
}
