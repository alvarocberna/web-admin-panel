'use client'
import { useState } from 'react'
import Image from 'next/image'
import {InicioSesionForm} from '@/features';

const DEMO_CREDENTIALS = { email: 'demo@gmail.com', password: 'Demo12345678' };

export function PortadaInicio() {
  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState<'A' | 'B'>('A');

  function openModal() {
    setSection('A');
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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

          {/* Botón Demo */}
          {/* <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              className="
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                text-zinc-800 font-semibold text-sm
                shadow-lg shadow-blue-900/40
                transition-all duration-200
              "
              style={{ background: 'var(--gradient-primary)' }}
              onClick={openModal}
            >
              Ver demo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-zinc-100 border border-white/10 shadow-2xl p-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-900 hover:text-zinc-700 cursor-pointer transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {section === 'A' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 mb-2">Prueba el demo</h2>
                  <p className="text-zinc-700 text-sm leading-relaxed">
                    Ingresa con el usuario Demo a un proyecto de prueba. Este usuario posee el rol 'user' por lo que solo tiene
                    acceso al panel principal, sección articulos y perfil. Cualquier instancia de la entidad articulo creada 
                    requiere aprovación para ser publicada, por lo que no será visible.
                  </p>
                </div>
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-zinc-800 font-semibold text-sm shadow-lg transition-all duration-200"
                  style={{ background: 'var(--gradient-primary)' }}
                  onClick={() => setSection('B')}
                >
                  Continuar
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {section === 'B' && (
              <div className="flex flex-col">
                <div className='mb-3'>
                  <h2 className="text-lg font-bold text-zinc-900 mb-1">Iniciar sesión</h2>
                  <p className="text-zinc-700 text-xs">Credenciales de demo precargadas</p>
                </div>
                <InicioSesionForm defaultValues={DEMO_CREDENTIALS} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
