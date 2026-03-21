import { ContenedorAdmin, TitleSec } from '@/shared';
import { ListaUsuarios } from '@/features';

export default function UsuariosPage() {
    return (
        <ContenedorAdmin>
            <TitleSec title="Usuarios" />
            <ListaUsuarios />
        </ContenedorAdmin>
    );
}
