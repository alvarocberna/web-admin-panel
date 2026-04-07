'use client'
//NEXT
import Link from 'next/link';
import Image from 'next/image';
//FEATURES
import { ArticuloEntity } from '@/features/project';

interface ArticuloCardProps {
    articulo: ArticuloEntity;
}

export function ArticuloCard({ articulo }: ArticuloCardProps){
    return(
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
                <div className='px-4 py-3'>
                    <h4 className='text-md font-semibold text-zinc-900'>{articulo.titulo}</h4>
                </div>
            </Link>
        </div>
    )
}
