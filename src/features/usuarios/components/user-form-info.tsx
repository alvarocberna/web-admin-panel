'use client'
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input, stripTags, trimOnly } from '@/shared';
import { UsuarioService } from '../services/usuario.service';
import { UpdateUsuarioInfoDto, UpdateUsuarioDto } from '../dtos/usuario.dto';

interface InfoForm {
    nombre: string;
    apellido: string;
    email: string;
}

export function UserFormInfo() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<InfoForm>();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const data = await UsuarioService.getUsuario();
                reset({ nombre: data.nombre, apellido: data.apellido, email: data.email });
            } catch (error) {
                console.error('Error obteniendo usuario:', error);
                toast.error('Error al cargar los datos del usuario');
            }
        };
        fetchUsuario();
    }, [reset]);

    const onSubmit = async (formData: InfoForm) => {
        setLoading(true);
        try {
            const payload: UpdateUsuarioDto = {
                nombre: stripTags(formData.nombre),
                apellido: stripTags(formData.apellido),
                email: trimOnly(formData.email),
            };
            await UsuarioService.updateUsuarioInfo(payload);
            toast.success('Información actualizada correctamente');
        } catch (error) {
            console.error('Error actualizando información:', error);
            toast.error('Error al actualizar la información');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card px-6 py-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-1">Información personal</h2>
            <p className="text-sm text-zinc-500 mb-5">Actualiza tu nombre, apellido y correo electrónico.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                    label="Nombre"
                    name="nombre"
                    register={register}
                    rules={{ required: 'El nombre es requerido',  minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                />
                {errors.nombre && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.nombre.message}</p>
                )}

                <Input
                    label="Apellido"
                    name="apellido"
                    register={register}
                    rules={{ required: 'El apellido es requerido',  minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 50, message: 'Máximo 50 caracteres' } }}
                />
                {errors.apellido && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.apellido.message}</p>
                )}

                <Input
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    register={register}
                    rules={{
                        required: 'El correo es requerido',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
                         minLength: { value: 1, message: 'Mínimo 1 carácter' }, maxLength: { value: 100, message: 'Máximo 100 caracteres' }
                    }}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>
                )}

                <div className="mt-5 flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}
