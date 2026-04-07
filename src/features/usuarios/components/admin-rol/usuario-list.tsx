'use client'
//REACT
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
//FEATURES
import { UsuarioService, UsuarioEntity, UsuarioAdminForm } from '@/features';

interface ListaUsuariosProps {
    proyectoId?: string;
}

export function UsuarioList({ proyectoId: proyectoIdProp }: ListaUsuariosProps = {}) {
    const [proyectoId, setProyectoId] = useState<string | null>(proyectoIdProp ?? null);
    const [usuarios, setUsuarios] = useState<UsuarioEntity[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<UsuarioEntity | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState<UsuarioEntity | null>(null);

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
        setModalOpen(true);
    };

    const openEdit = (usuario: UsuarioEntity) => {
        setEditingUsuario(usuario);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUsuario(null);
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

            {proyectoId && (
                <UsuarioAdminForm
                    open={modalOpen}
                    editingUsuario={editingUsuario}
                    proyectoId={proyectoId}
                    onClose={closeModal}
                    onCreated={setUsuarios}
                    onUpdated={actualizado => setUsuarios(prev => prev.map(u => u.id === actualizado.id ? actualizado : u))}
                />
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
