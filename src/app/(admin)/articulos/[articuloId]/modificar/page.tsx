'use client'
//react
import { useParams } from 'next/navigation'
//shared
import { TitleSec } from '@/shared'
//features
import { ArticuloFormUpdate } from '@/features'

export default function ModificarArticuloPage() {
    const id_articulo = useParams<{ articuloId: string }>().articuloId

    return (
        <>
            <TitleSec title='Modificar Articulo' />
            <ArticuloFormUpdate id_articulo={id_articulo} />
        </>
    )
}
