import {ContenedorAdmin, TitleSec} from '@/shared';
import {NuevoArticulo} from '@/features';

export default function CrearArticulo(){
    return(
        <ContenedorAdmin>
            <TitleSec title='Nuevo Articulo'/>
            <NuevoArticulo/>
        </ContenedorAdmin>
    )
}