'use client'
//react
import { useState, useEffect } from 'react';
//next
import Link from 'next/link';
import Image from 'next/image';
//features
import {ArticulosService, ArticuloEntity} from '@/features/project';
import {ContenedorSec} from '@/shared/project'

export function Articulos(){
    const [articulos, setArticulos] = useState<ArticuloEntity[]>([])
    const [loading, setLoading] = useState(true)

    //traemos los articulos al cargar el componente
    useEffect(() => {
        const fetchArticulos = async () => {
            try{
                const data = await ArticulosService.getArticulos();
                setArticulos(data);
            }catch(error){
                console.log("error: " + error)
            }finally{
                setLoading(false)
            }
        }
        fetchArticulos();
    }, []);

    //componente con todos los articulos
    const listaArticulos = articulos.map((articulo: ArticuloEntity, index: number) => {
        return(
            <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4' key={index}>
                <Link href={`project/articulos/${articulo.id}`} className='card hover-btn w-full flex flex-col overflow-hidden'>
                    <div className='w-full h-48 relative'>
                        <Image
                            src={articulo.image_url || ''}
                            alt={articulo.image_alt!}
                            fill={true}
                            unoptimized
                            className='object-cover'
                        />
                    </div>
                    <div className='px-4 py-3'>
                        <h4 className='text-base font-semibold text-zinc-900'>{articulo.titulo}</h4>
                    </div>
                </Link>
            </div>
        )
    })

    return(
        <ContenedorSec id='articulos'>
            <div className='w-full flex flex-col'>
                <h2 className='w-full mb-8 text-2xl font-semibold text-zinc-900 tracking-tight'>
                    Artículos
                </h2>
                {
                    loading ?
                    <div className="w-full flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
                    </div>
                    :
                    <div className='w-full flex flex-wrap -mx-2 pb-10'>
                        {listaArticulos}
                    </div>
                }
            </div>
        </ContenedorSec>
    )
}