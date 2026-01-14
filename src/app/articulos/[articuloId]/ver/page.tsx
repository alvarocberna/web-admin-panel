'use client'
//next
import { useParams } from "next/navigation"
//react
import { useState, useEffect } from "react";
import Image from "next/image";
//features
import { ArticulosService, SecArticuloEntity } from "@/features";
//shared
import {ContenedorAdmin} from '@/shared';

export default function VerArticulo(){
    const id_articulo = useParams<{articuloId: string}>().articuloId;
    const [articulo, setArticulo] = useState<any>(null);
    useEffect(() => {
        const fetchArticulo = async () => {
            try{
                const data = await ArticulosService.getArticuloById(id_articulo);
                setArticulo(data);
            }catch(error){
                console.log("error: " + error)
            }
        }
        fetchArticulo();
    }, [])
    //fecha
    const fecha = new Date(articulo?.fecha_publicacion);
    const anno = fecha.getFullYear();
    const mes = (fecha.getMonth()+1).toString().padStart(2, "0");
    const dia = fecha.getDay().toString().padStart(2, "0");

    return(
        <ContenedorAdmin>
            {articulo && (
                <div className="text-black">
                    <h3 className="text-3xl mb-2">{articulo.titulo}</h3>
                    <h4 className="text-xl mb-10">{articulo.subtitulo}</h4>
                    <div>
                        {articulo.sec_articulo.map((data: SecArticuloEntity, index: number) => (
                            <SecArticulo key={index} data={data} />
                        ))}
                    </div>
                    <p>Autor: {articulo.autor}</p>
                    <p>Publicado el {dia}/{mes}/{anno}</p>
                </div>
            )}  
        </ContenedorAdmin>
    )
}

interface SecArticuloInterface {
    data: SecArticuloEntity,
}

function SecArticulo({data}: SecArticuloInterface){
    const imagePosition = data.image_position;
    const flex = imagePosition === 'left' ? 'flex flex-row-reverse' : 'flex';
    const textW = (imagePosition === 'left' || imagePosition === 'right') ? '[60%]' : 'full';
    const imgW = (imagePosition === 'left' || imagePosition === 'right') ? '[40%]' : 'full';
    const textHidden = imagePosition === 'all' ? 'hidden' : '';
    const imgHidden = imagePosition === 'none' ? 'hidden' : '';
    return(
        <div className={`${flex} justify-between mb-10`}>
            <div className={`w-${textW} ${textHidden} px-2`} >
                <h4 className="text-2xl">{data.titulo_sec}</h4>
                <p className="text-md">{data.contenido_sec}</p> 
            </div>
            <div className={`w-${imgW} h-75  ${imgHidden} relative `}>
                <Image 
                    src={data.image_url || ''} 
                    alt={data.image_alt || ''} 
                    fill unoptimized 
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 40vw"
                />
            </div>
        </div>
    )
}