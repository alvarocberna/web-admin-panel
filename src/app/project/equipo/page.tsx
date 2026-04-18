import { EquipoPublic } from '@/features/project';
import { EquipoService } from '@/features/project';

export default async function ProjectEquipoPage() {

    const [equipo] = await Promise.all([
        EquipoService.getEquipo()
    ])

    return (
        <div className="flex flex-col">
            <EquipoPublic dataEquipo={equipo}/>
        </div>
    );
}
