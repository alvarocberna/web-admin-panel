import { ArticulosEntity } from '../entities/articulos.entity'
import { UsuarioEntity } from '@/features/usuarios/entities/usuario.entity'
import { ArticulosForm } from './articulos-form.component'
import { ArticuloList } from './articulo-list.component'

interface Props {
    articulosPromise: Promise<ArticulosEntity | null>
    usuarioPromise: Promise<UsuarioEntity>
}

export async function ArticulosContent({ articulosPromise, usuarioPromise }: Props) {
    const [articulos, usuario] = await Promise.all([articulosPromise, usuarioPromise])

    return (
        <>
            <ArticulosForm articulos={articulos} rol={usuario?.rol} />
            {articulos && (
                <ArticuloList
                    articulos={articulos.articulo ?? []}
                    rol={usuario?.rol}
                />
            )}
        </>
    )
}
