'use client'
//REACT
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
//SHARED
import { Input, stripTags, trimOnly } from '@/shared';
//FEATURES
import { ProyectoService, EquipoService, ServiciosService, ArticulosService, TestimoniosService, UsuarioService } from '@/features';
import { ProyectoEntity } from '@/features';

interface CrearForm {
    nombreProyecto: string;
    descripcion: string;
    cliente: string;
    activo: boolean;
    equipoHabilitado: boolean;
    serviciosHabilitado: boolean;
    articulosHabilitado: boolean;
    testimoniosHabilitado: boolean;
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

export function ProyectoForm({ onClose, onCreado }: Props) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<CrearForm>({
        defaultValues: {
            activo: true,
            equipoHabilitado: true,
            serviciosHabilitado: true,
            articulosHabilitado: true,
            testimoniosHabilitado: true,
            rol: 'ADMIN',
        },
    });

    const onSubmit = async (data: CrearForm) => {
        setLoading(true);
        try {
            const proyecto = await ProyectoService.createProyecto({
                nombreProyecto: stripTags(data.nombreProyecto),
                descripcion: stripTags(data.descripcion),
                cliente: stripTags(data.cliente),
                activo: data.activo,
                equipoHabilitado: data.equipoHabilitado,
                serviciosHabilitado: data.serviciosHabilitado,
                articulosHabilitado: data.articulosHabilitado,
                testimoniosHabilitado: data.serviciosHabilitado,
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: data.password,
                rol: data.rol,
            });

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
                                <Input label="Nombre del proyecto" name="nombreProyecto" register={register} rules={{ required: 'El nombre es requerido', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }} />
                                {errors.nombreProyecto && <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombreProyecto.message}</p>}
                            </div>
                            <div>
                                <Input label="Descripción" name="descripcion" register={register} rules={{ required: 'La descripción es requerida', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 500, message: 'Máximo 500 caracteres' } }} />
                                {errors.descripcion && <p className="text-xs text-red-500 mt-1 ml-1">{errors.descripcion.message}</p>}
                            </div>
                            <div>
                                <Input label="Cliente" name="cliente" register={register} rules={{ required: 'El cliente es requerido', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 200, message: 'Máximo 200 caracteres' } }} />
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
                                { name: 'equipoHabilitado' as const, label: 'Equipo' },
                                { name: 'serviciosHabilitado' as const, label: 'Servicios' },
                                { name: 'articulosHabilitado' as const, label: 'Artículos' },
                                { name: 'testimoniosHabilitado' as const, label: 'Testimonios' },
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
                                    <Input label="Nombre" name="nombre" register={register} rules={{ required: 'El nombre es requerido', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }} />
                                    {errors.nombre && <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre.message}</p>}
                                </div>
                                <div>
                                    <Input label="Apellido" name="apellido" register={register} rules={{ required: 'El apellido es requerido',  minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }} />
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
                                         minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 100, message: 'Máximo 50 caracteres' }
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
                                    rules={{ required: 'La contraseña es requerida', minLength: { value: 12, message: 'Mínimo 12 caracteres' }, maxLength: {value: 30, message: 'Máximo 30 caracteres'} }}
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
