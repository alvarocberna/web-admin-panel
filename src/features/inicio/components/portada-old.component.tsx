'use client'
import { useState } from 'react'
import Image from 'next/image'
import {InicioSesionForm} from '@/features';


export function PortadaInicio() {

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">

      {/* Imagen de fondo */}
      <Image
        src="/images/img-fondo-portada.png"
        alt="Fondo portada"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Overlay: oscurece el lado izquierdo, se aclara hacia la derecha */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/50" />

      {/* Contenedor de contenido*/}
      <div className="relative z-10 w-full flex justify-start">

        {/* Contenido — 40 % derecho en escritorio, full en móvil */}
        <div className="w-full sm:w-[60%] md:w-[50%] lg:w-[50%] xl:w-[40%] flex flex-col gap-6 mx-5 md:mx-10 lg:mx-20">

          {/* Tag */}
          <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full border border-[#b3acff]/40 bg-blue-500/15 text-[#b3acff] text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b3acff] animate-pulse" />
            CMS personalizado
          </span>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
            Admnistra el<br/>
              <span
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              contenido
            </span> {' '}
            de tu web<br/>
            de forma simple
          </h1>

        </div>
      </div>

    </section>
  )
}
