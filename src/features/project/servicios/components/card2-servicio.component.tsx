'use client'
import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-brands-svg-icons'
import { useState } from "react"
import { ServicioEntity } from "@/features/project"

interface SerivicioProps{
    titulo: string,
    img: string,
    ruta: string,
    icon: IconDefinition,
}

export function Card2Servicio(srv: ServicioEntity) {
    const [opacity, setOpacity] = useState<number>(70)

    return (
        <Link className="px-0 mb-10  w-full sm:w-[48%] lg:w-[30%]" href={'/'}
            style={{ height: '250px', position: 'relative', borderRadius: '12px' }} onMouseEnter={() => setOpacity(50)} onMouseLeave={() => setOpacity(70)}>
            <Image src={`${srv.img_url}`} alt='...' fill={true} style={{ position: 'absolute', borderRadius: '12px' }}></Image>
            <div className="w-full h-full absolute transition-all duration-300 ease-in-out bg-black"  style={{ borderRadius: '12px', opacity: opacity / 100 }}></div>
            <div className="w-full h-full flex flex-col items-center justify-center" style={{ position: 'absolute' }}>
                {/* <FontAwesomeIcon icon={icon} className="mb-5" style={{ color: 'white', width: '60px', height: '60px' }} /> */}
                <p className="text-white text-2xl mb-4 text-center"> {srv.nombre_servicio}</p>
            </div>
        </Link>
    )
}