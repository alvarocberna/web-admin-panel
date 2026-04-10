'use client'
//NEXT
import Link from 'next/link';
import Image from 'next/image';
//FEATURES
import { ArticuloEntity } from '@/features/project';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface ArticuloCardProps {
    articulo: ArticuloEntity;
}

const ESTILO: 'estilo1' | 'estilo2' = 'estilo2';

export function ArticuloCard({ articulo }: ArticuloCardProps){
    let date = new Date(articulo.fecha_publicacion)
    let fecha = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');

    return(
        <>
        {
            ESTILO === 'estilo2' ? (
                <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4'>
                    <Link href={`/project/articulos/${articulo.slug}`} className='card hover-btn w-full flex flex-col overflow-hidden'>
                        <div className='w-full h-48 relative'>
                            <Image
                                src={articulo.image_url || ''}
                                alt={articulo.image_alt!}
                                fill={true}
                                unoptimized
                                className='object-cover'
                            />
                        </div>
                        {/* cuerpo */}
                        <div className='mx-5 mt-5 mb-5 pb-5 border-b border-gris-claro'>
                            <h4 className='text-md font-semibold text-zinc-900'>{articulo.titulo}</h4>
                            {
                                articulo.subtitulo &&
                                <div className='text-xs text-zinc-500'>
                                    {articulo.subtitulo}
                                </div>
                                
                            }
                        </div>
                        <div className='mx-5 mb-5 text-xs text-zinc-500 flex justify-between'>
                            <span>
                                {fecha}
                            </span>
                            <span className='text-cs font-semibold text-zinc-900'>
                                Leer articulo <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </div>
                    </Link>
                </div>
            )
            :
            (
                <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4'>
                    <Link href={`/project/articulos/${articulo.slug}`} className='card hover-btn w-full flex flex-col overflow-hidden'>
                        <div
                            className="h-2 w-full"
                            style={{ background: '#7c6fbf' }}
                        /> 
                        {/* cuerpo */}
                        <div className='mx-6 mt-6 mb-6 pb-6 border-b border-gris-claro'>
                            <h4 className='text-md font-semibold text-zinc-900'>{articulo.titulo}</h4>
                            {
                                articulo.subtitulo &&
                                <div className='text-xs text-zinc-500'>
                                    {articulo.subtitulo}
                                </div>
                                
                            }
                        </div>
                        <div className='mx-6 mb-6 text-xs text-zinc-500 flex justify-between'>
                            <span>
                                {fecha}
                            </span>
                            <span className='text-cs font-semibold text-zinc-900'>
                                Leer articulo <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </div>
                    </Link>
                </div>
            )
        }
        </>
    )
}

