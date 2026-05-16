'use client'
//NEXT
import { useRouter } from 'next/navigation';
//REACT
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
//SHARED
import { Input, stripTags, trimOnly } from '@/shared';
//FEATURES
import { UpdateUsuarioDto, UsuarioService } from '@/features';
import { UsuarioEntity } from '../../entities/usuario.entity';

interface InfoForm {
    nombre: string;
    apellido: string;
    email: string;
}

interface Props {
    usuario: UsuarioEntity;
}

export function UsuarioFormUserUpdate({ usuario }: Props) {
    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InfoForm>({
        defaultValues: { nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email },
    });

    useEffect(() => {
        reset({ nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email });
    }, [usuario, reset]);

    const onSubmit = async (formData: InfoForm) => {
        try {
            const payload: UpdateUsuarioDto = {
                nombre: stripTags(formData.nombre),
                apellido: stripTags(formData.apellido),
                email: trimOnly(formData.email),
            };
            await UsuarioService.updateUsuarioInfo(payload);
            toast.success('Información actualizada correctamente');
            router.refresh();
        } catch (error) {
            console.error('Error actualizando información:', error);
            toast.error('Error al actualizar la información');
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}
