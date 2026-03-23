'use client'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/shared';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioEntity } from '../entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dtos/usuario.dto';

interface UsuarioForm {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: string;
}

interface ListaUsuariosProps {
    proyectoId?: string;
}

export function ListaUsuarios({ proyectoId: proyectoIdProp }: ListaUsuariosProps = {}) {
    const [proyectoId, setProyectoId] = useState<string | null>(proyectoIdProp ?? null);
    const [usuarios, setUsuarios] = useState<UsuarioEntity[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<UsuarioEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState<UsuarioEntity | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UsuarioForm>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let pid = proyectoIdProp ?? null;
                if (!pid) {
                    const yo = await UsuarioService.getUsuario();
                    pid = yo.proyecto_id;
                }
                setProyectoId(pid);
                const lista = await UsuarioService.getUsuariosAdmin(pid);
                setUsuarios(lista);
            } catch (error) {
                console.error('Error cargando usuarios:', error);
                toast.error('Error al cargar los usuarios');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [proyectoIdProp]);

    const openCreate = () => {
        setEditingUsuario(null);
        reset({ nombre: '', apellido: '', email: '', password: '', rol: 'USER' });
        setModalOpen(true);
    };

    const openEdit = (usuario: UsuarioEntity) => {
        setEditingUsuario(usuario);
        reset({ nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, password: '', rol: usuario.rol });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUsuario(null);
    };

    const onSubmit = async (data: UsuarioForm) => {
        if (!proyectoId) return;
        try {
            if (editingUsuario) {
                const payload: UpdateUsuarioDto = {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    email: data.email,
                    rol: data.rol,
                };
                const actualizado = await UsuarioService.updateUsuarioAdmin(editingUsuario.id, payload);
                setUsuarios(prev => prev.map(u => u.id === actualizado.id ? actualizado : u));
                toast.success('Usuario actualizado correctamente');
            } else {
                const payload: CreateUsuarioDto = {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    email: data.email,
                    password: data.password,
                    rol: data.rol,
                };
                const nuevo = await UsuarioService.createUsuarioAdmin(payload, proyectoId);
                setUsuarios(prev => [...prev, nuevo]);
                toast.success('Usuario creado correctamente');
            }
            closeModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al guardar el usuario');
        }
    };

    const openDeleteModal = (usuario: UsuarioEntity) => {
        setUsuarioToDelete(usuario);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setUsuarioToDelete(null);
        setDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!usuarioToDelete || !proyectoId) return;
        try {
            await UsuarioService.deleteUsuarioAdmin(usuarioToDelete.id, proyectoId);
            setUsuarios(prev => prev.filter(u => u.id !== usuarioToDelete.id));
            toast.success('Usuario eliminado correctamente');
            closeDeleteModal();
        } catch (error: any) {
            toast.error(error?.message || 'Error al eliminar el usuario');
            closeDeleteModal();
        }
    };

    if (loading) {
        return <div className="py-16 text-center text-zinc-400 text-sm">Cargando...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-500">{usuarios.length} {usuarios.length === 1 ? 'usuario' : 'usuarios'}</p>
                <button type="button" onClick={openCreate} className="btn btn-primary h-8 text-xs px-3 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPlus} style={{ width: '11px', height: '11px' }} />
                    Nuevo usuario
                </button>
            </div>

            {usuarios.length === 0 ? (
                <div className="card py-14 text-center text-zinc-400 text-sm">
                    No hay usuarios registrados en este proyecto.
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100">
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Nombre</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Email</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">Rol</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {usuarios.map(u => (
                                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-zinc-900">
                                        {u.nombre} {u.apellido}
                                    </td>
                                    <td className="px-5 py-3.5 text-zinc-600">{u.email}</td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-600">
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(u)}
                                                className="btn btn-outline h-7 text-xs px-2.5"
                                                title="Editar usuario"
                                            >
                                                <FontAwesomeIcon icon={faPencil} style={{ width: '11px', height: '11px' }} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(u)}
                                                className="btn btn-ghost-destructive h-7 text-xs px-2.5"
                                                title="Eliminar usuario"
                                            >
                                                <FontAwesomeIcon icon={faTrash} style={{ width: '11px', height: '11px' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal crear/editar */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                            <h3 className="text-base font-semibold text-zinc-900">
                                {editingUsuario ? 'Editar usuario' : 'Nuevo usuario'}
                            </h3>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors">
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
                                        rules={{ required: 'El nombre es requerido' }}
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
                                        rules={{ required: 'El apellido es requerido' }}
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
                                            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
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
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : editingUsuario ? 'Guardar cambios' : 'Crear usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal confirmación eliminar */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeDeleteModal} />
                    <div className="relative card p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-base font-semibold text-zinc-900 mb-1">Eliminar usuario</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Esta acción no se puede deshacer. ¿Seguro que deseas eliminar a{' '}
                            <span className="font-medium text-zinc-700">
                                {usuarioToDelete?.nombre} {usuarioToDelete?.apellido}
                            </span>?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={closeDeleteModal} className="btn btn-outline">Cancelar</button>
                            <button onClick={confirmDelete} className="btn btn-destructive">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
