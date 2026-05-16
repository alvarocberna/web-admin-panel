'use client'
import { UsuarioFormUserUpdate, UsuarioFormPassword } from '@/features';
import { UsuarioEntity } from '../../entities/usuario.entity';

interface Props {
    usuario: UsuarioEntity;
}

export function PerfilUsuario({ usuario }: Props) {
    return (
        <div className="flex flex-col gap-6 max-w-lg">
            <UsuarioFormUserUpdate usuario={usuario} />
            <UsuarioFormPassword />
        </div>
    );
}
