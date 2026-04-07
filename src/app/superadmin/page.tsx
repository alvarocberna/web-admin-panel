'use client'
//REACT
import { useState } from 'react';
//SHARED
import { ContenedorAdmin, TitleSec } from '@/shared';
//FEATURES
import { ProyectoEntity, ProyectoList, Proyecto } from '@/features';

export default function SuperAdminPage() {
    const [selectedProyecto, setSelectedProyecto] = useState<ProyectoEntity | null>(null);

    return (
        <ContenedorAdmin>
            {selectedProyecto ? (
                <Proyecto
                    proyecto={selectedProyecto}
                    onBack={() => setSelectedProyecto(null)}
                />
            ) : (
                <>
                    <TitleSec title="Superadmin" />
                    <ProyectoList onSelectProyecto={setSelectedProyecto} />
                </>
            )}
        </ContenedorAdmin>
    );
}
