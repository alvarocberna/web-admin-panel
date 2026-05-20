import { Suspense } from 'react'
//FEATURES - imports directos para evitar que next/headers llegue al bundle cliente via barrel
import { CardBienvenida }  from '@/features/dashboard/components/card-bienvenida.component'
import { CardProyecto }    from '@/features/dashboard/components/card-proyecto.component'
import { CardEquipo }      from '@/features/dashboard/components/card-equipo.component'
import { CardServicios }   from '@/features/dashboard/components/card-servicios.component'
import { CardArticulos }   from '@/features/dashboard/components/card-articulos.component'
import { CardTestimonios } from '@/features/dashboard/components/card-testimonios.component'
import { UsuarioService }    from '@/features/usuarios/services/usuario.server.service'
import { EquipoService }     from '@/features/equipo/services/equipo.server.service'
import { ServiciosService }  from '@/features/servicios/services/servicios.server.service'
import { ArticulosService }  from '@/features/articulos/services/articulos.server.service'
import { TestimoniosService } from '@/features/testimonios/services/testimonios.server.service'

export default function Dashboard() {

    const usuarioPromise     = UsuarioService.getUsuario()
    const equipoPromise      = EquipoService.getEquipo()
    const serviciosPromise   = ServiciosService.getServicios()
    const articulosPromise   = ArticulosService.getArticulos()
    const testimoniosPromise = TestimoniosService.getTestimonios()

    return (
        <div className="flex flex-col gap-4">
            <Suspense fallback={<div className="card px-6 py-7 w-full animate-pulse h-20" />}>
                <CardBienvenida promise={usuarioPromise} />
            </Suspense>
            <Suspense fallback={<div className="card px-6 py-5 w-full animate-pulse h-24" />}>
                <CardProyecto promise={usuarioPromise} />
            </Suspense>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Suspense fallback={<div className="card px-6 py-6 animate-pulse h-20" />}>
                    <CardEquipo promise={equipoPromise} />
                </Suspense>
                <Suspense fallback={<div className="card px-6 py-6 animate-pulse h-20" />}>
                    <CardServicios promise={serviciosPromise} />
                </Suspense>
                <Suspense fallback={<div className="card px-6 py-6 animate-pulse h-20" />}>
                    <CardArticulos usuarioPromise={usuarioPromise} articulosPromise={articulosPromise} />
                </Suspense>
                <Suspense fallback={<div className="card px-6 py-6 animate-pulse h-20" />}>
                    <CardTestimonios usuarioPromise={usuarioPromise} testimoniosPromise={testimoniosPromise} />
                </Suspense>
            </div>
        </div>
    )
}
