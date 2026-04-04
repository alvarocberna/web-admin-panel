import {ContenedorAdmin, TitleSec} from '@/shared';
import {ArticuloFormCreate} from '@/features';

export default function CrearArticulo(){
    return(
        <ContenedorAdmin>
            <TitleSec title='Nuevo Articulo'/>
            <ArticuloFormCreate/>
        </ContenedorAdmin>
    )
}