import { EquipoServicePublic, EmpleadoPublic } from '@/features';

export default async function EmpleadoPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const [empleado] = await Promise.all([
        EquipoServicePublic.getEmpleadoBySlug(slug)
    ])
    
    return (
        <div className="flex flex-col">
            <EmpleadoPublic dataEmpleado={empleado} />
        </div>
    );
}
