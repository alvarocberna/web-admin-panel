'use client'
import { UsuarioFormUserUpdate, UsuarioFormPassword } from '@/features';

export function PerfilUsuario() {
    return (
        <div className="flex flex-col gap-6 max-w-lg">
            <UsuarioFormUserUpdate />
            <UsuarioFormPassword />
        </div>
    );
}
