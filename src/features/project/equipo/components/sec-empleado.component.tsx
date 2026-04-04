'use client'
//IMAGE
import Image from "next/image";
//FEATURES
import { SecEmpleadoEntity } from "@/features/project";

interface SecEmpleadoProps {
    data: SecEmpleadoEntity;
}

export function SecEmpleado({ data }: SecEmpleadoProps) {
    const imagePosition = data.image_position;
    const flex = imagePosition === 'left' ? 'flex flex-row-reverse' : 'flex';
    const textW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[60%]' : 'w-full';
    const imgW = (imagePosition === 'left' || imagePosition === 'right') ? 'w-[40%]' : 'w-full';
    const textHidden = imagePosition === 'all' ? 'hidden' : '';
    const imgHidden = (imagePosition === 'none' || !data.image_url) ? 'hidden' : '';

    return (
        <div className={`${flex} gap-6 mb-10`}>
            <div className={`${textW} ${textHidden}`}>
                {data.titulo_sec && (
                    <h4 className="text-xl font-semibold text-zinc-900 tracking-tight mb-3">{data.titulo_sec}</h4>
                )}
                {data.contenido_sec && (
                    <p className="text-base text-zinc-600 leading-relaxed">{data.contenido_sec}</p>
                )}
            </div>
            <div className={`${imgW} min-h-64 ${imgHidden} relative`}>
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
    );
}
