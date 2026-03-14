'use client'
//react
import { useParams } from 'next/navigation';
//shared
import {ContenedorAdmin, TitleSec} from '@/shared';
//features
import {ModificarArticulo} from '@/features';


export default function ModificarArticuloPage(){
    //definimos variables
    const id_articulo = useParams<{articuloId: string}>().articuloId;

    return(
        <ContenedorAdmin>
            <TitleSec title='Modificar Articulo'/>
            <ModificarArticulo id_articulo={id_articulo} />
        </ContenedorAdmin>
    )
}