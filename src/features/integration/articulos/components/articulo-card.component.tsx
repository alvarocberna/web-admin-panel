'use client'
//NEXT
import Link from 'next/link';
import Image from 'next/image';
//FEATURES
import { ArticuloEntityPublic } from '@/features';
//CONFIG
import { INTEGRATION_CONFIG } from '@/features/integration/config';
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface ArticuloCardProps {
    articulo: ArticuloEntityPublic;
}

const ESTILO = INTEGRATION_CONFIG.articulo.estilo;

export function ArticuloCardPublic({ articulo }: ArticuloCardProps){
    let date = new Date(articulo.fecha_publicacion)
    let fecha = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');

    return(
        <>
        {
            ESTILO === 'estilo2' ? (
                <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4'>
                    <Link href={`/project/articulos/${articulo.slug}`} className='card hover-btn w-full h-full flex flex-col justify-between overflow-hidden'>
                        <div>
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
                            <div className='mx-5 my-5'>
                                <h4 className='text-md font-semibold text-zinc-900'>{articulo.titulo}</h4>
                                {
                                    articulo.subtitulo &&
                                    <div className='text-xs text-zinc-500'>
                                        {articulo.subtitulo}
                                    </div>
                                    
                                }
                            </div>
                        </div>
                        <div className='mx-5 mb-5 pt-5 text-xs text-zinc-500 border-t border-zinc-500 flex justify-between'>
                            <span>
                                {fecha}
                            </span>
                            <span className='text-cs font-semibold text-zinc-700'>
                                Leer articulo <FontAwesomeIcon icon={faArrowRight} style={{fontSize: '12px'}}/>
                            </span>
                        </div>
                    </Link>
                </div>
            )
            :
            (
                <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4'>
                    <Link href={`/project/articulos/${articulo.slug}`} className='card hover-btn w-full h-full flex flex-col justify-between overflow-hidden'>
                        <div>
                            <div
                                className="h-2 w-full"
                                style={{ background: '#7c6fbf' }}
                            /> 
                            {/* cuerpo */}
                            <div className='mx-6 my-6'>
                                <h4 className='text-md font-semibold text-zinc-700'>{articulo.titulo}</h4>
                                {
                                    articulo.subtitulo &&
                                    <div className='text-xs text-zinc-500'>
                                        {articulo.subtitulo}
                                    </div>
                                    
                                }
                            </div>
                        </div>
                        <div className='mx-6 mb-6 pt-6 text-xs text-zinc-500 flex justify-between border-t border-zinc-500'>
                            <span>
                                {fecha}
                            </span>
                            <span className='text-cs font-semibold text-zinc-700'>
                                Leer articulo <FontAwesomeIcon icon={faArrowRight} style={{fontSize: '12px'}}/>
                            </span>
                        </div>
                    </Link>
                </div>
            )
        }
        </>
    )
}

