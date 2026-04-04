import { ContenedorAdmin, TitleSec } from '@/shared';
import { UsuarioList } from '@/features';

export default function UsuariosPage() {
    return (
        <ContenedorAdmin>
            <TitleSec title="Usuarios" />
            <UsuarioList />
        </ContenedorAdmin>
    );
}
