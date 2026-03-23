'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContenedorAdmin } from '@/shared';
import { UsuarioEntity, EquipoEntity, ServiciosEntity, ArticulosEntity, TestimoniosEntity, ProyectoEntity } from '@/features';
import { UsuarioService } from '@/features/usuarios/services/usuario.service';
import { EquipoService } from '@/features/equipo/services/equipo.service';
import { ServiciosService } from '@/features/servicios/services/servicios.service';
import { ArticulosService } from '@/features/articulos/services/articulos.service';
import { TestimoniosService } from '@/features/testimonios/services/testimonios.service';
import { ProyectoService } from '@/features/proyectos/services/proyecto.service';

export default function Dashboard() {
    const [usuario, setUsuario] = useState<UsuarioEntity>()
    const [proyecto, setProyecto] = useState<ProyectoEntity | null>(null)
    const [equipo, setEquipo] = useState<EquipoEntity | null>(null)
    const [servicios, setServicios] = useState<ServiciosEntity | null>(null)
    const [articulos, setArticulos] = useState<ArticulosEntity | null>(null)
    const [testimonios, setTestimonios] = useState<TestimoniosEntity | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const usuario = await UsuarioService.getUsuario().catch(() => null)
            setUsuario(usuario ?? undefined)

            const [proyectoRes, equipoRes, serviciosRes, articulosRes, testimoniosRes] =
                await Promise.allSettled([
                    usuario ? ProyectoService.getProyecto(usuario.proyecto_id) : Promise.resolve(null),
                    EquipoService.getEquipo(),
                    ServiciosService.getServicios(),
                    ArticulosService.getArticulos(),
                    TestimoniosService.getTestimonios(),
                ])

            if (proyectoRes.status === 'fulfilled') setProyecto(proyectoRes.value ?? null)
            if (equipoRes.status === 'fulfilled') setEquipo(equipoRes.value)
            if (serviciosRes.status === 'fulfilled') setServicios(serviciosRes.value)
            if (articulosRes.status === 'fulfilled') setArticulos(articulosRes.value)
            if (testimoniosRes.status === 'fulfilled') setTestimonios(testimoniosRes.value)
        }
        fetchData()
    }, [])

    const totalArticulos = articulos?.articulo?.length ?? 0
    const pendientesArticulos = articulos?.articulo?.filter(a => a.status === 'pending').length ?? 0
    const totalTestimonios = testimonios?.testimonio?.length ?? 0
    const pendientesTestimonios = testimonios?.testimonio?.filter(t => t.status === 'pending').length ?? 0
    const totalEmpleados = equipo?.empleado?.length ?? 0
    const totalServicios = servicios?.servicio?.length ?? 0

    return (
        <ContenedorAdmin>
            <div className="flex flex-col gap-4">

                {/* Card bienvenida */}
                <div className="card px-6 py-7 w-full">
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-1">Bienvenido</p>
                    <h2 className="text-xl font-semibold text-zinc-900">
                        {usuario?.nombre ? `${usuario.nombre} ${usuario.apellido ?? ''}` : usuario?.email ?? '—'}
                    </h2>
                    {usuario?.email && usuario?.nombre && (
                        <p className="text-sm text-zinc-500 mt-0.5">{usuario.email}</p>
                    )}
                </div>

                {/* Card proyecto */}
                <div>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-2">Proyecto</p>
                    <div className="card px-6 py-5 w-full">
                        <p className="text-lg font-semibold text-zinc-900 mb-1">
                            {proyecto?.nombre_proyecto ?? '—'}
                        </p>
                        <p className="text-sm text-zinc-500">
                            Estado:{' '}
                            <span className={proyecto?.activo ? 'text-green-600 font-medium' : 'text-zinc-400 font-medium'}>
                                {proyecto ? (proyecto.activo ? 'Activo' : 'Inactivo') : '—'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Cards resumen */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Equipo */}
                    <div className="card px-6 py-6">
                        <p className="text-base font-semibold text-zinc-900 mb-3">Equipo</p>
                        <p className="text-sm text-zinc-600">
                            {totalEmpleados} {totalEmpleados === 1 ? 'empleado' : 'empleados'}
                        </p>
                    </div>

                    {/* Servicios */}
                    <div className="card px-6 py-6">
                        <p className="text-base font-semibold text-zinc-900 mb-3">Servicios</p>
                        <p className="text-sm text-zinc-600">
                            {totalServicios} {totalServicios === 1 ? 'servicio' : 'servicios'}
                        </p>
                    </div>

                    {/* Artículos */}
                    <div className="card px-6 py-6">
                        <p className="text-base font-semibold text-zinc-900 mb-3">Artículos</p>
                        <p className="text-sm text-zinc-600">
                            {totalArticulos} {totalArticulos === 1 ? 'artículo' : 'artículos'}
                        </p>
                        {(usuario?.rol === 'ADMIN' || usuario?.rol === 'SUPERADMIN') && (
                            <Link
                                href="/articulos"
                                className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                            >
                                {pendientesArticulos} pendiente{pendientesArticulos !== 1 ? 's' : ''} de aprobación →
                            </Link>
                        )}
                    </div>

                    {/* Testimonios */}
                    <div className="card px-6 py-6">
                        <p className="text-base font-semibold text-zinc-900 mb-3">Testimonios</p>
                        <p className="text-sm text-zinc-600">
                            {totalTestimonios} {totalTestimonios === 1 ? 'testimonio' : 'testimonios'}
                        </p>
                        {(usuario?.rol === 'ADMIN' || usuario?.rol === 'SUPERADMIN') && (
                            <Link
                                href="/testimonios"
                                className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                            >
                                {pendientesTestimonios} pendiente{pendientesTestimonios !== 1 ? 's' : ''} de aprobación →
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </ContenedorAdmin>
    )
}
