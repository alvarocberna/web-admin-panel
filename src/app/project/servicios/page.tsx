//FEATURES
import { ServiciosPublic } from '@/features/project';
import { ServiciosService } from '@/features/project';

export default async function ProjectServiciosPage() {

    const [servicios] = await Promise.all([
        ServiciosService.getServicios()
    ])

    return (
        <div className="flex flex-col">
            <ServiciosPublic dataServicios={servicios}/>
        </div>
    );
}
