import { ContenedorAdmin, TitleSec } from '@/shared';
import { PerfilUsuario } from '@/features';

export default function Usuario() {
    return (
        <ContenedorAdmin>
            <TitleSec title="Mi perfil" />
            <PerfilUsuario />
        </ContenedorAdmin>
    );
}
