'use client'
//react
import { useParams } from 'next/navigation';
//shared
import {ContenedorAdmin, TitleSec} from '@/shared';
//features
import {ArticuloFormUpdate} from '@/features';


export default function ModificarArticuloPage(){
    //definimos variables
    const id_articulo = useParams<{articuloId: string}>().articuloId;

    return(
        <ContenedorAdmin>
            <TitleSec title='Modificar Articulo'/>
            <ArticuloFormUpdate id_articulo={id_articulo} />
        </ContenedorAdmin>
    )
}