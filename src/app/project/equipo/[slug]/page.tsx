import { EquipoService, EmpleadoPublic } from '@/features/project';

export default async function EmpleadoPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const [empleado] = await Promise.all([
        EquipoService.getEmpleadoBySlug(slug)
    ])
    
    return (
        <div className="flex flex-col">
            <EmpleadoPublic dataEmpleado={empleado} />
        </div>
    );
}
