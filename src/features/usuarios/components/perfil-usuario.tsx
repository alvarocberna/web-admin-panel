'use client'
import { UserFormInfo } from './user-form-info';
import { UserFormPassword } from './user-form-password';

export function PerfilUsuario() {
    return (
        <div className="flex flex-col gap-6 max-w-lg">
            <UserFormInfo />
            <UserFormPassword />
        </div>
    );
}
