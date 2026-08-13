import { EquipoPublic } from '@/features';
import { EquipoServicePublic } from '@/features';

export default async function ProjectEquipoPage() {

    const [equipo] = await Promise.all([
        EquipoServicePublic.getEquipo()
    ])

    return (
        <div className="flex flex-col">
                <EquipoPublic equipo={equipo} comportamiento='navegar'/>
        </div>
    );
}
