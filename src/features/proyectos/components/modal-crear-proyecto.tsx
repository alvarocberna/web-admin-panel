'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/shared';
import { ProyectoService } from '../services/proyecto.service';
import { ProyectoEntity } from '../entities/proyecto.entity';
import { EquipoService } from '@/features/equipo/services/equipo.service';
import { ServiciosService } from '@/features/servicios/services/servicios.service';
import { ArticulosService } from '@/features/articulos/services/articulos.service';
import { TestimoniosService } from '@/features/testimonios/services/testimonios.service';
import { UsuarioService } from '@/features/usuarios/services/usuario.service';

interface CrearForm {
    nombre_proyecto: string;
    descripcion: string;
    cliente: string;
    activo: boolean;
    equipo_habilitado: boolean;
    servicios_habilitado: boolean;
    articulos_habilitado: boolean;
    testimonios_habilitado: boolean;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: string;
}

interface Props {
    onClose: () => void;
    onCreado: (proyecto: ProyectoEntity) => void;
}

export function ModalCrearProyecto({ onClose, onCreado }: Props) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CrearForm>({
        defaultValues: {
            activo: true,
            equipo_habilitado: true,
            servicios_habilitado: true,
            articulos_habilitado: true,
            testimonios_habilitado: true,
            rol: 'ADMIN',
        },
    });

    const onSubmit = async (data: CrearForm) => {
        setLoading(true);
        try {
            const proyecto = await ProyectoService.createProyecto({
                nombre_proyecto: data.nombre_proyecto,
                descripcion: data.descripcion,
                cliente: data.cliente,
                activo: data.activo,
            });
            const proyecto_id = proyecto.id;

            await Promise.allSettled([
                EquipoService.createEquipo(
                    { titulo: 'Equipo', descripcion: null, activo: true, notificacion: false, habilitado: data.equipo_habilitado },
                    proyecto_id,
                ),
                ServiciosService.createServicios(
                    { titulo: 'Servicios', descripcion: null, icono: null, activo: true, notificacion: false, habilitado: data.servicios_habilitado },
                    proyecto_id,
                ),
                ArticulosService.createArticulos(
                    { titulo: 'Artículos', descripcion: '', activo: true, aprobar: false, notificacion: false, habilitado: data.articulos_habilitado },
                    proyecto_id,
                ),
                TestimoniosService.createTestimonios(
                    { titulo: 'Testimonios', descripcion: '', activo: true, aprobar: false, notificacion: false, habilitado: data.testimonios_habilitado },
                    proyecto_id,
                ),
            ]);

            await UsuarioService.createUsuarioAdmin(
                { nombre: data.nombre, apellido: data.apellido, email: data.email, password: data.password, rol: data.rol },
                proyecto_id,
            );

            toast.success('Proyecto creado correctamente');
            onCreado(proyecto);
        } catch (error: any) {
            toast.error(error?.message || 'Error al crear el proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
                    <h3 className="text-base font-semibold text-zinc-900">Nuevo proyecto</h3>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
                        <FontAwesomeIcon icon={faXmark} style={{ width: '16px', height: '16px' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 flex flex-col gap-5">

                    {/* Proyecto */}
                    <div>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-3">Proyecto</p>
                        <div className="flex flex-col gap-3">
                            <div>
                                <Input label="Nombre del proyecto" name="nombre_proyecto" register={register} rules={{ required: 'El nombre es requerido' }} />
                                {errors.nombre_proyecto && <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre_proyecto.message}</p>}
                            </div>
                            <div>
                                <Input label="Descripción" name="descripcion" register={register} rules={{ required: 'La descripción es requerida' }} />
                                {errors.descripcion && <p className="text-xs text-red-500 mt-1 ml-1">{errors.descripcion.message}</p>}
                            </div>
                            <div>
                                <Input label="Cliente" name="cliente" register={register} rules={{ required: 'El cliente es requerido' }} />
                                {errors.cliente && <p className="text-xs text-red-500 mt-1 ml-1">{errors.cliente.message}</p>}
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" {...register('activo')} className="w-4 h-4 rounded border-zinc-300 accent-zinc-900" />
                                <span className="text-sm text-zinc-700">Activo</span>
                            </label>
                        </div>
                    </div>

                    {/* Secciones */}
                    <div>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-3">Secciones habilitadas</p>
                        <div className="card px-4 py-3 flex flex-col gap-2.5">
                            {([
                                { name: 'equipo_habilitado' as const, label: 'Equipo' },
                                { name: 'servicios_habilitado' as const, label: 'Servicios' },
                                { name: 'articulos_habilitado' as const, label: 'Artículos' },
                                { name: 'testimonios_habilitado' as const, label: 'Testimonios' },
                            ]).map(sec => (
                                <label key={sec.name} className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="checkbox" {...register(sec.name)} className="w-4 h-4 rounded border-zinc-300 accent-zinc-900" />
                                    <span className="text-sm text-zinc-700">{sec.label}</span>
                                </label>
                            ))}
                            <p className="text-xs text-zinc-400 mt-1">
                                El historial de actividad se inicializa automáticamente con el proyecto.
                            </p>
                        </div>
                    </div>

                    {/* Usuario administrador */}
                    <div>
                        <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-3">Usuario administrador</p>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-x-3">
                                <div>
                                    <Input label="Nombre" name="nombre" register={register} rules={{ required: 'El nombre es requerido' }} />
                                    {errors.nombre && <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre.message}</p>}
                                </div>
                                <div>
                                    <Input label="Apellido" name="apellido" register={register} rules={{ required: 'El apellido es requerido' }} />
                                    {errors.apellido && <p className="text-xs text-red-500 mt-1 ml-1">{errors.apellido.message}</p>}
                                </div>
                            </div>
                            <div>
                                <Input
                                    label="Correo electrónico"
                                    name="email"
                                    type="email"
                                    register={register}
                                    rules={{
                                        required: 'El correo es requerido',
                                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
                                    }}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <Input
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    register={register}
                                    rules={{ required: 'La contraseña es requerida', minLength: { value: 8, message: 'Mínimo 8 caracteres' } }}
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                            </div>
                            <div className="relative w-full">
                                <select
                                    id="rol"
                                    {...register('rol', { required: 'El rol es requerido' })}
                                    className="block px-3 pb-2.5 pt-4 w-full text-sm text-zinc-900 bg-transparent rounded-lg border border-zinc-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer transition-colors duration-150"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                                <label
                                    htmlFor="rol"
                                    className="absolute text-sm text-zinc-500 duration-150 transform -translate-y-4 scale-75 top-2 left-2 z-10 origin-[0] bg-white px-2"
                                >
                                    Rol
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear proyecto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
