'use client'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input } from '@/shared';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioEntity } from '../entities/usuario.entity';
import { UpdateUsuarioInfoDto, UpdateUsuarioPasswordDto } from '../dtos/usuario.dto';

interface InfoForm {
    nombre: string;
    apellido: string;
    email: string;
}

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
}

export function PerfilUsuario() {
    const [usuario, setUsuario] = useState<UsuarioEntity | null>(null);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const { register: registerInfo, handleSubmit: handleSubmitInfo, reset: resetInfo, formState: { errors: errorsInfo } } = useForm<InfoForm>();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: errorsPassword } } = useForm<PasswordForm>();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await UsuarioService.getUsuario();
                setUsuario(data);
                resetInfo({ nombre: data.nombre, apellido: data.apellido, email: data.email });
            } catch (error) {
                console.error('Error obteniendo usuario:', error);
                toast.error('Error al cargar los datos del usuario');
            }
        };
        fetchUsuario();
    }, [resetInfo]);

    const onSubmitInfo = async (formData: InfoForm) => {
        setLoadingInfo(true);
        try {
            const payload: UpdateUsuarioInfoDto = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
            };
            const actualizado = await UsuarioService.updateUsuarioInfo(payload);
            setUsuario(actualizado);
            toast.success('Información actualizada correctamente');
        } catch (error) {
            console.error('Error actualizando información:', error);
            toast.error('Error al actualizar la información');
        } finally {
            setLoadingInfo(false);
        }
    };

    const onSubmitPassword = async (formData: PasswordForm) => {
        setLoadingPassword(true);
        try {
            const payload: UpdateUsuarioPasswordDto = {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            };
            await UsuarioService.updateUsuarioPassword(payload);
            resetPassword();
            toast.success('Contraseña actualizada correctamente');
        } catch (error) {
            console.error('Error actualizando contraseña:', error);
            toast.error('Error al actualizar la contraseña');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-lg">

            {/* Información personal */}
            <div className="card px-6 py-6">
                <h2 className="text-base font-semibold text-zinc-900 mb-1">Información personal</h2>
                <p className="text-sm text-zinc-500 mb-5">Actualiza tu nombre, apellido y correo electrónico.</p>

                <form onSubmit={handleSubmitInfo(onSubmitInfo)} noValidate>
                    <Input
                        label="Nombre"
                        name="nombre"
                        register={registerInfo}
                        rules={{ required: 'El nombre es requerido' }}
                    />
                    {errorsInfo.nombre && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errorsInfo.nombre.message}</p>
                    )}

                    <Input
                        label="Apellido"
                        name="apellido"
                        register={registerInfo}
                        rules={{ required: 'El apellido es requerido' }}
                    />
                    {errorsInfo.apellido && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errorsInfo.apellido.message}</p>
                    )}

                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        register={registerInfo}
                        rules={{
                            required: 'El correo es requerido',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
                        }}
                    />
                    {errorsInfo.email && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errorsInfo.email.message}</p>
                    )}

                    <div className="mt-5 flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loadingInfo}
                        >
                            {loadingInfo ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Cambiar contraseña */}
            <div className="card px-6 py-6">
                <h2 className="text-base font-semibold text-zinc-900 mb-1">Cambiar contraseña</h2>
                <p className="text-sm text-zinc-500 mb-5">Introduce tu contraseña actual y la nueva contraseña.</p>

                <form onSubmit={handleSubmitPassword(onSubmitPassword)} noValidate>
                    <Input
                        label="Contraseña actual"
                        name="currentPassword"
                        type="password"
                        register={registerPassword}
                        rules={{ required: 'La contraseña actual es requerida' }}
                    />
                    {errorsPassword.currentPassword && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errorsPassword.currentPassword.message}</p>
                    )}

                    <Input
                        label="Nueva contraseña"
                        name="newPassword"
                        type="password"
                        register={registerPassword}
                        rules={{
                            required: 'La nueva contraseña es requerida',
                            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                        }}
                    />
                    {errorsPassword.newPassword && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errorsPassword.newPassword.message}</p>
                    )}

                    <div className="mt-5 flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loadingPassword}
                        >
                            {loadingPassword ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}
