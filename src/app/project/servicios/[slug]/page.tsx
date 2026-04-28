import { ServiciosService, ServicioPublic } from '@/features/project';

export default async function ServicioPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const [servicio] = await Promise.all([
        ServiciosService.getServicioBySlug(slug)
    ])
    
    return (
        <div className="flex flex-col">
            <ServicioPublic dataServicio={servicio} />
        </div>
    );
}
