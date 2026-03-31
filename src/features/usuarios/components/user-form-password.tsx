'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input } from '@/shared';
import { UsuarioService } from '../services/usuario.service';
import { UpdateUsuarioPasswordDto } from '../dtos/usuario.dto';

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
}

export function UserFormPassword() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordForm>();

    const onSubmit = async (formData: PasswordForm) => {
        setLoading(true);
        try {
            const payload: UpdateUsuarioPasswordDto = {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            };
            await UsuarioService.updateUsuarioPassword(payload);
            reset();
            toast.success('Contraseña actualizada correctamente');
        } catch (error) {
            console.error('Error actualizando contraseña:', error);
            toast.error('Error al actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card px-6 py-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-1">Cambiar contraseña</h2>
            <p className="text-sm text-zinc-500 mb-5">Introduce tu contraseña actual y la nueva contraseña.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                    label="Contraseña actual"
                    name="currentPassword"
                    type="password"
                    register={register}
                    rules={{ required: 'La contraseña actual es requerida',  minLength: { value: 12, message: 'Mínimo 12 carácter' }, maxLength: { value: 30, message: 'Máximo 30 caracteres' } }}
                />
                {errors.currentPassword && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.currentPassword.message}</p>
                )}

                <Input
                    label="Nueva contraseña"
                    name="newPassword"
                    type="password"
                    register={register}
                    rules={{
                        required: 'La nueva contraseña es requerida',
                        minLength: { value: 12, message: 'Mínimo 30 caracteres' },
                    }}
                />
                {errors.newPassword && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.newPassword.message}</p>
                )}

                <div className="mt-5 flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Cambiar contraseña'}
                    </button>
                </div>
            </form>
        </div>
    );
}
