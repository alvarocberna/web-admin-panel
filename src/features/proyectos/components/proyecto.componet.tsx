'use client'
//REACT
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
//FEATURES
import { ProyectoEntity, EquipoEntity, ServiciosEntity, ArticulosEntity, TestimoniosEntity } from '@/features';
import { EquipoService, ServiciosService, ArticulosService, TestimoniosService, UsuarioList } from '@/features';


interface SectionState {
    equipo: EquipoEntity | null;
    servicios: ServiciosEntity | null;
    articulos: ArticulosEntity | null;
    testimonios: TestimoniosEntity | null;
}

interface Props {
    proyecto: ProyectoEntity;
    onBack: () => void;
}

interface ToggleProps {
    checked: boolean;
    onChange: (val: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-zinc-800' : 'bg-zinc-200'}`}
        >
            <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-1'}`}
            />
        </button>
    );
}

export function Proyecto({ proyecto, onBack }: Props) {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<SectionState>({ equipo: null, servicios: null, articulos: null, testimonios: null });

    useEffect(() => {
        const fetchSections = async () => {
            setLoading(true);
            const [equipoRes, serviciosRes, articulosRes, testimoniosRes] = await Promise.allSettled([
                EquipoService.getEquipo(proyecto.id),
                ServiciosService.getServicios(proyecto.id),
                ArticulosService.getArticulos(proyecto.id),
                TestimoniosService.getTestimonios(proyecto.id),
            ]);
            setSections({
                equipo: equipoRes.status === 'fulfilled' ? equipoRes.value : null,
                servicios: serviciosRes.status === 'fulfilled' ? serviciosRes.value : null,
                articulos: articulosRes.status === 'fulfilled' ? articulosRes.value : null,
                testimonios: testimoniosRes.status === 'fulfilled' ? testimoniosRes.value : null,
            });
            setLoading(false);
        };
        fetchSections();
    }, [proyecto.id]);

    const toggleEquipo = async (habilitado: boolean) => {
        if (!sections.equipo) return;
        try {
            const updated = await EquipoService.updateEquipo(
                { titulo: sections.equipo.titulo, descripcion: sections.equipo.descripcion ?? '', activo: sections.equipo.activo, notificacion: sections.equipo.notificacion, habilitado },
                proyecto.id,
            );
            setSections(prev => ({ ...prev, equipo: updated }));
            toast.success(`Equipo ${habilitado ? 'habilitado' : 'deshabilitado'}`);
        } catch {
            toast.error('Error al actualizar Equipo');
        }
    };

    const toggleServicios = async (habilitado: boolean) => {
        if (!sections.servicios) return;
        try {
            const updated = await ServiciosService.updateServicios(
                { titulo: sections.servicios.titulo, descripcion: sections.servicios.descripcion ?? '', icono: sections.servicios.icono ?? '', activo: sections.servicios.activo, notificacion: sections.servicios.notificacion, habilitado },
                proyecto.id,
            );
            setSections(prev => ({ ...prev, servicios: updated }));
            toast.success(`Servicios ${habilitado ? 'habilitado' : 'deshabilitado'}`);
        } catch {
            toast.error('Error al actualizar Servicios');
        }
    };

    const toggleArticulos = async (habilitado: boolean) => {
        if (!sections.articulos) return;
        try {
            const updated = await ArticulosService.updateArticulos(
                { titulo: sections.articulos.titulo, descripcion: sections.articulos.descripcion ?? '', activo: sections.articulos.activo, aprobar: sections.articulos.aprobar, notificacion: sections.articulos.notificacion, habilitado },
                proyecto.id,
            );
            setSections(prev => ({ ...prev, articulos: updated }));
            toast.success(`Artículos ${habilitado ? 'habilitado' : 'deshabilitado'}`);
        } catch {
            toast.error('Error al actualizar Artículos');
        }
    };

    const toggleTestimonios = async (habilitado: boolean) => {
        if (!sections.testimonios) return;
        try {
            const updated = await TestimoniosService.updateTestimonios(
                { titulo: sections.testimonios.titulo, descripcion: sections.testimonios.descripcion ?? '', activo: sections.testimonios.activo, aprobar: sections.testimonios.aprobar, notificacion: sections.testimonios.notificacion, habilitado },
                proyecto.id,
            );
            setSections(prev => ({ ...prev, testimonios: updated }));
            toast.success(`Testimonios ${habilitado ? 'habilitado' : 'deshabilitado'}`);
        } catch {
            toast.error('Error al actualizar Testimonios');
        }
    };

    const sectionRows = [
        { label: 'Equipo', entity: sections.equipo, onToggle: toggleEquipo },
        { label: 'Servicios', entity: sections.servicios, onToggle: toggleServicios },
        { label: 'Artículos', entity: sections.articulos, onToggle: toggleArticulos },
        { label: 'Testimonios', entity: sections.testimonios, onToggle: toggleTestimonios },
    ];

    return (
        <div className="flex flex-col gap-6">

            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="btn btn-outline h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '13px', height: '13px' }} />
                </button>
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900">{proyecto.nombre_proyecto}</h2>
                    {proyecto.cliente && <p className="text-sm text-zinc-500">{proyecto.cliente}</p>}
                </div>
            </div>

            {/* Información del proyecto */}
            <div className="card px-6 py-5">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-4">Información del proyecto</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-xs text-zinc-400 uppercase tracking-wide mb-0.5">Nombre</dt>
                        <dd className="text-zinc-900 font-medium">{proyecto.nombre_proyecto}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-zinc-400 uppercase tracking-wide mb-0.5">Cliente</dt>
                        <dd className="text-zinc-900">{proyecto.cliente || '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-zinc-400 uppercase tracking-wide mb-0.5">Estado</dt>
                        <dd>
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${proyecto.activo ? 'bg-green-50 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                {proyecto.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs text-zinc-400 uppercase tracking-wide mb-0.5">Fecha creación</dt>
                        <dd className="text-zinc-900">
                            {proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString('es-CL') : '—'}
                        </dd>
                    </div>
                    {proyecto.descripcion && (
                        <div className="sm:col-span-2">
                            <dt className="text-xs text-zinc-400 uppercase tracking-wide mb-0.5">Descripción</dt>
                            <dd className="text-zinc-600">{proyecto.descripcion}</dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* Secciones */}
            <div>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-3">Secciones</p>
                {loading ? (
                    <div className="card py-8 text-center text-zinc-400 text-sm">Cargando...</div>
                ) : (
                    <div className="card overflow-hidden divide-y divide-zinc-100">
                        {sectionRows.map(sec => (
                            <div key={sec.label} className="flex items-center justify-between px-5 py-4">
                                <div>
                                    <p className="text-sm font-medium text-zinc-900">{sec.label}</p>
                                    {sec.entity === null && (
                                        <p className="text-xs text-zinc-400 mt-0.5">No configurada</p>
                                    )}
                                </div>
                                {sec.entity !== null && (
                                    <Toggle checked={sec.entity.habilitado} onChange={sec.onToggle} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Usuarios */}
            <div>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-3">Usuarios</p>
                <UsuarioList proyectoId={proyecto.id} />
            </div>
        </div>
    );
}
