'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { EquipoEntityPublic, ServiciosEntityPublic, ArticulosEntityPublic, TestimoniosEntityPublic } from '@/features'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN — modifica estas constantes para cambiar el comportamiento
// ─────────────────────────────────────────────────────────────────────────────
const STICKY_ON_SCROLL = true        // true: el menú queda fixed al hacer scroll | false: baja con la página
const TRANSPARENT_DEFAULT = true     // true: el menú empieza transparente | false: siempre tiene fondo de color
const SCROLL_BG_COLOR = 'bg-superficie'   // clase Tailwind del fondo al hacer scroll (ej: 'bg-superficie', 'bg-superficie-oscura')
const DEFAULT_BG_COLOR = 'bg-superficie'  // clase Tailwind del fondo cuando TRANSPARENT_DEFAULT = false
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
    equipo: EquipoEntityPublic | null
    servicios: ServiciosEntityPublic | null
    articulos: ArticulosEntityPublic | null
    testimonios: TestimoniosEntityPublic | null
}

export function NavbarInnerPublic({ equipo, servicios, articulos, testimonios }: Props) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const hasBg = STICKY_ON_SCROLL ? (scrolled || !TRANSPARENT_DEFAULT) : !TRANSPARENT_DEFAULT
    const positionClass = STICKY_ON_SCROLL ? 'fixed' : 'absolute'

    const navLinks = [
        { label: 'Servicios',    href: '/#servicios',   activo: servicios?.activo },
        { label: 'Equipo',       href: '/#equipo',      activo: equipo?.activo },
        { label: 'Testimonios',  href: '/#testimonios', activo: testimonios?.activo },
        { label: 'Artículos',   href: '/#articulos',   activo: articulos?.activo },
    ].filter(link => link.activo)

    const textColor = 'text-gris-oscuro'
    const lineColor = 'bg-gris-oscuro'
    const bgClass   = hasBg ? SCROLL_BG_COLOR : 'bg-transparent'

    return (
        <nav className={`${positionClass} top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass} ${hasBg ? 'shadow-md' : ''}`}>
            
            {/* Bar */}
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-16">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <img src="/media/img_logo.png" alt="Logo" className="h-10 w-auto object-contain" />
                    </Link>

                    {/* Navegación desktop */}
                    <div className="hidden md:flex items-center gap-8 ">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-lila ${textColor}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/#contacto"
                            className="ml-2 px-5 py-2 rounded-full bg-lila text-texto-invertido text-sm font-medium hover:bg-lila-oscuro transition-colors"
                        >
                            Contacto
                        </Link>
                    </div>

                    {/* Botón hamburguesa (mobile) */}
                    <button
                        className="md:hidden p-2 rounded-md cursor-pointer"
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="Abrir menú"
                    >
                        <span className={`block w-6 h-0.5 mb-1.5 transition-all ${lineColor}`} />
                        <span className={`block w-6 h-0.5 mb-1.5 transition-all ${lineColor}`} />
                        <span className={`block w-6 h-0.5 transition-all ${lineColor}`} />
                    </button>
                </div>
            </div>

            {/* Menú desplegable mobile */}
            {menuOpen && (
                <div className={`md:hidden px-4 pb-4 ${hasBg ? SCROLL_BG_COLOR : DEFAULT_BG_COLOR} shadow-md`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-4 text-sm font-medium text-gris-oscuro hover:text-lila border-b border-gris-claro last:border-0"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/#contacto"
                        onClick={() => setMenuOpen(false)}
                        className="block mt-3 px-4 py-2 rounded-full bg-lila text-texto-invertido text-sm font-medium text-center hover:bg-lila-oscuro transition-colors"
                    >
                        Contacto
                    </Link>
                </div>
            )}
        </nav>
    )
}
