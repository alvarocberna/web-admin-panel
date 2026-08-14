'use client'
//NEXT
import Image from "next/image";
//FEATURES
import { SecArticuloEntityPublic } from "../entities/sec-articulo.entity";

interface SecArticuloInterface {
    data: SecArticuloEntityPublic,
}

export function SecArticuloPublic({data}: SecArticuloInterface){
    const imagePosition = data.image_position;
    const flex = imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row';
    const textW = (imagePosition === 'left' || imagePosition === 'right') ? 'md:w-[60%]' : 'md:w-full';
    const imgW = (imagePosition === 'left' || imagePosition === 'right') ? 'md:w-[40%]' : 'md:w-full';
    const textHidden = imagePosition === 'all' ? 'hidden' : '';
    const imgHidden = imagePosition === 'none' ? 'hidden' : '';

    return(
        <div className={`flex flex-col ${flex} gap-6 mb-10`}>
            <div className={`w-full ${textW} ${textHidden}`}>
                <h4 className="text-xl font-semibold text-texto tracking-tight mb-3">{data.titulo_sec}</h4>
                <p className="text-base text-gris leading-relaxed">{data.contenido_sec}</p>
            </div>
            <div className={`w-full ${imgW} min-h-64 ${imgHidden} relative`}>
                <Image
                    src={data.image_url || ''}
                    alt={data.image_alt || ''}
                    fill={true}
                    unoptimized
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, 40vw"
                />
            </div>
        </div>
    )
}