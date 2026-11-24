'use client'
//REACT
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
//SHARED
import { Input } from '@/shared';
//FEATURES
import { UsuarioService, UsuarioEntity, CreateUsuarioDto, UpdateUsuarioDto } from '@/features';

interface UsuarioForm {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: string;
}

interface UsuarioAdminFormProps {
    open: boolean;
    editingUsuario: UsuarioEntity | null;
    proyectoId: string;
    onClose: () => void;
    onCreated: (usuarios: UsuarioEntity[]) => void;
    onUpdated: (usuario: UsuarioEntity) => void;
}

export function UsuarioAdminForm({ open, editingUsuario, proyectoId, onClose, onCreated, onUpdated }: UsuarioAdminFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UsuarioForm>();

    useEffect(() => {
        if (open) {
            if (editingUsuario) {
                reset({ nombre: editingUsuario.nombre, apellido: editingUsuario.apellido, email: editingUsuario.email, password: '', rol: editingUsuario.rol });
            } else {
                reset({ nombre: '', apellido: '', email: '', password: '', rol: 'USER' });
            }
        }
    }, [open, editingUsuario, reset]);

    const onSubmit = async (data: UsuarioForm) => {
        try {
            if (editingUsuario) {
                const payload: UpdateUsuarioDto = {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    email: data.email,
                    rol: data.rol,
                };
                const actualizado = await UsuarioService.updateUsuarioAdmin(editingUsuario.id, payload);
                onUpdated(actualizado);
                toast.success('Usuario actualizado correctamente');
            } else {
                const payload: CreateUsuarioDto = {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    email: data.email,
                    password: data.password,
                    rol: data.rol,
                    imgUrl: null,
                    imgAlt: null,
                };
                await UsuarioService.createUsuarioAdmin(payload, proyectoId);
                const lista = await UsuarioService.getUsuariosAdmin(proyectoId);
                onCreated(lista);
                toast.success('Usuario creado correctamente');
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el usuario');
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                    <h3 className="text-base font-semibold text-zinc-900">
                        {editingUsuario ? 'Editar usuario' : 'Nuevo usuario'}
                    </h3>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
                        <FontAwesomeIcon icon={faXmark} style={{ width: '16px', height: '16px' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 flex flex-col gap-0.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <div>
                            <Input
                                label="Nombre"
                                name="nombre"
                                register={register}
                                rules={{ required: 'El nombre es requerido', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                            />
                            {errors.nombre && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Apellido"
                                name="apellido"
                                register={register}
                                rules={{ required: 'El apellido es requerido', minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                            />
                            {errors.apellido && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.apellido.message}</p>
                            )}
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
                                minLength: { value: 1, message: 'Mínimo 1 carácter' },
                                maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                            }}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>
                        )}
                    </div>

                    {!editingUsuario && (
                        <div>
                            <Input
                                label="Contraseña"
                                name="password"
                                type="password"
                                register={register}
                                rules={{
                                    required: 'La contraseña es requerida',
                                    minLength: { value: 12, message: 'Mínimo 12 caracteres' },
                                    maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                                }}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>
                            )}
                        </div>
                    )}

                    <div className="relative w-full mt-3">
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
                        {errors.rol && (
                            <p className="text-xs text-red-500 mt-1 ml-1">{errors.rol.message}</p>
                        )}
                    </div>

                    <div className="mt-5 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="btn btn-outline">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : editingUsuario ? 'Guardar cambios' : 'Crear usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
