'use client'
import { useState, useEffect } from 'react'
import {InicioSesionForm} from '@/features';
import Image from 'next/image'

export function NavbarInicio() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])


  return (
    <>
      {/* ── Barra de navegación ───────────────────────── */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${scrolled
            ? 'bg-white shadow-sm border-b border-zinc-100'
            : 'bg-transparent'
          }
        `}
      >

        {/* Navbar */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between ">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors duration-300 ${scrolled ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
              L 
            </div>
            <span className={`font-semibold text-sm tracking-tight transition-colors duration-300 ${scrolled ? 'text-zinc-900' : 'text-white'}`}>
              Logo
            </span>
          </a>

          <div className="flex items-center gap-2">
            {/* Botón Iniciar Sesion */}
            <button
              onClick={() => setModalOpen(true)}
              className={`
                hidden md:inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-200 cursor-pointer
                ${scrolled
                  ? ' text-gray-800 hover:text-white'
                  : 'text-gray-800 hover:text-violet-800'
                }
              `}
              style={{background: 'var(--gradient-primary)',}}
            >
              Iniciar sesión
            </button>

            {/* Hamburguesa — móvil */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${scrolled ? 'text-zinc-700 hover:bg-zinc-100' : 'text-white hover:bg-white/10'}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Menú móvil desplegable */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-200 ease-in-out
            ${scrolled ? 'bg-white border-b border-zinc-100' : 'bg-black/40 backdrop-blur-sm'}
            ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <nav className="px-4 py-3 flex flex-col gap-1">
            <button
              onClick={() => { setMenuOpen(false); setModalOpen(true) }}
              className={`
                mt-1 px-3 py-2 rounded-md text-sm font-medium text-left transition-colors duration-150
                ${scrolled
                  ? 'border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white'
                  : 'text-zinc-700 bg-white hover:text-white hover:bg-[#b3acff]'
                }
              `}
            >
              Iniciar sesión
            </button>
          </nav>
        </div>
      </header>

      {/* ── Modal iniciar sesión ─────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-900">Iniciar sesión</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <InicioSesionForm/>

          </div>
        </div>
      )}

    </>
  )
}
