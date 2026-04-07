'use client'
//REACT
import { useState, useEffect } from 'react';
//FEATURES
import {ArticulosService, ArticuloEntity, ArticulosEntity} from '@/features/project';
//SHARED
import {ContenedorSec} from '@/shared/project'
//COMPONENTS
import { ArticuloCard } from './articulo-card.component';

export function ArticulosPublic(){
    const [articulos, setArticulos] = useState<ArticulosEntity | null>(null) //seccion articulos
    const [loading, setLoading] = useState(true)

    //traemos los articulos al cargar el componente
    useEffect(() => {
        const fetchArticulos = async () => {
            try{
                const data: ArticulosEntity = await ArticulosService.getArticulos();
                setArticulos(data);
            }catch(error){
                console.log("error: " + error)
            }finally{
                setLoading(false)
            }
        }
        fetchArticulos();
    }, []);

    if(!articulos){
        return null;
    }

    const articulosFiltrados = articulos.articulo.filter(art => art.status === 'approved' && art.activo === true);

    return(
        <div>
            {
                articulos.activo &&
                    <ContenedorSec id='articulos'>
                        <div className='w-full flex flex-col'>
                            <h2 className='w-full mb-4 text-2xl font-semibold text-zinc-900 tracking-tight'>
                                {articulos.titulo}
                            </h2>
                            {
                                articulos.descripcion &&
                                <p className='text-zinc-700 font-md mb-4'>
                                    {articulos.descripcion}
                                </p>
                            }
                            {
                                loading ?
                                <div className="w-full flex justify-center items-center py-16">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
                                </div>
                                :
                                <div className='w-full flex flex-wrap -mx-2 pb-10'>
                                    {articulosFiltrados.map((art: ArticuloEntity, index: number) => (
                                        <ArticuloCard key={index} articulo={art} />
                                    ))}
                                </div>
                            }
                        </div>
                    </ContenedorSec>
            }
        </div>
    )
}