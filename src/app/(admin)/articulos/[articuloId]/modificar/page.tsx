'use client'
//react
import { useParams } from 'next/navigation'
//shared
import { TitleSec } from '@/shared'
//features
import { ArticuloFormUpdate } from '@/features'

export default function ModificarArticuloPage() {
    const articuloId = useParams<{ articuloId: string }>().articuloId

    return (
        <>
            <TitleSec title='Modificar Articulo' />
            <ArticuloFormUpdate articuloId={articuloId} />
        </>
    )
}
