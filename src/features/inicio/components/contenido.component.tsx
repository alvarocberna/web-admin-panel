'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function IconDocumento({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}

function IconUsuarios({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )
}

function IconMetricas({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

interface SeccionData {
  id: string
  titulo: string
  subtitulo: string
  descripcion: string
  etiqueta: string
  bgSeccion: string
  gradientePanel: string
  colorAcento: string
  video: string
  image: string
  icono: ReactNode
}

const SECCIONES: SeccionData[] = [
  {
    id: 'gestion',
    titulo: 'Gestión de Contenido',
    subtitulo: 'Gestión',
    etiqueta: 'Módulo 01',
    descripcion:
      'Crea, edita y organiza las secciones de tu sitio web —como tu equipo, servicios y artículos del blog— desde un panel centralizado e intuitivo.',
    bgSeccion: 'bg-slate-900',
    gradientePanel: 'from-blue-600 to-blue-950',
    video: '/videos/video-1.mp4',
    image: '',
    colorAcento: 'text-zinc-900',
    icono: <IconDocumento className="w-24 h-24 text-blue-100/60" />,
  },
  {
    id: 'control',
    titulo: 'Controla quien puede aportar',
    subtitulo: 'Control',
    etiqueta: 'Módulo 02',
    descripcion:
      'Permite a tus clientes compartir sus experiencias contigo, con la opción de aprobar previamente cada publicación. O, si lo prefieres, desactiva la aprobación previa y deja que todos comenten libremente. ¡Tú decides!',
    bgSeccion: 'bg-[#0e1220]',
    gradientePanel: 'from-violet-600 to-violet-950',
    video: '',
    image: '/images/img-comentarios.png',
    colorAcento: 'text-violet-400',
    icono: <IconUsuarios className="w-24 h-24 text-violet-100/60" />,
  },
  {
    id: 'usuarios',
    titulo: 'Gestión de usuarios',
    subtitulo: 'Usuarios',
    etiqueta: 'Módulo 03',
    descripcion:
      'Crea usuarios para los demás miembros de tu organización y asígnales distintos roles según el nivel de responsabilidad que desees otorgarles. Además, podrás supervisar los cambios realizados mediante tu aprobación previa.',
    bgSeccion: 'bg-[#091510]',
    gradientePanel: 'from-emerald-600 to-emerald-950',
    video: '',
    image: '/images/img-usuarios.png',
    colorAcento: 'text-emerald-400',
    icono: <IconMetricas className="w-24 h-24 text-emerald-100/60" />,
  },
]

export function ContenidoInicio() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const sections = sectionRefs.current.filter((s): s is HTMLDivElement => s !== null)
    const overlays = overlayRefs.current.filter((o): o is HTMLDivElement => o !== null)

    // Sections 1+ begin below the viewport (hidden by overflow-hidden on sticky container)
    for (let i = 1; i < sections.length; i++) {
      gsap.set(sections[i], { y: '100%' })
    }

    // Transitions are sequential: each starts when wrapper.top + i*sh reaches viewport top,
    // and ends when wrapper.top + (i+1)*sh reaches viewport top (one section-height of scroll each).
    // This guarantees section i is fully pinned before section i+1 starts sliding in.
    const sh = window.innerHeight * 0.9
    for (let i = 0; i < sections.length - 1; i++) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: () => `top+=${sh * i} top`,
          end: () => `top+=${sh * (i + 1)} top`,
          scrub: 1,
        },
      })

      tl.to(sections[i + 1], { y: 0, ease: 'none' }, 0)
      tl.to(overlays[i], { opacity: 0.78, ease: 'none' }, 0)
    }
  }, { scope: wrapperRef })

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: `${SECCIONES.length * 90}vh` }}
    >
      {/* Sticky viewport — sections stack absolutely inside */}
      <div className="sticky top-0 h-[90vh] overflow-hidden">
        {SECCIONES.map((sec, i) => (
          <div
            key={i}
            id={sec.id}
            ref={el => { sectionRefs.current[i] = el }}
            className={`absolute inset-0 bg-white`}
            style={{ zIndex: i + 1 }}
          >
            {/* Contenido */}
            <div className="w-full h-full flex flex-col-reverse md:flex-row">

              {/* Sección Izquierda */}
              <div 
                className={`w-full md:w-[50%] lg:w-[35%] h-[50%] md:h-full flex flex-col items-center justify-center gap-6 overflow-hidden`}
              >
                <div className="w-70 h-70 md:w-90 md:h-90 lg:w-100 lg:h-100 "
                >
                  {sec.video ? (
                    <video
                      src={sec.video}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : sec.image ? (
                    <img
                      src={sec.image}
                      alt={sec.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              </div>

              {/* Seccion Derecha */}
              <div className="w-full md:w-1/2 lg:w-[65%] h-[60%] md:h-full flex items-center px-8 sm:px-12 md:px-12 lg:px-12">
                {/* Etiqueta */}
                <div className="w-full">
                  <span 
                    className={`inline-flex items-center px-5 py-1 rounded-full text-sm mb-5 ${sec.colorAcento} bg-zinc-100`}
                  >
                    {sec.subtitulo}
                  </span>
                  {/* Titulo */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-zinc-900 mb-6">
                    {sec.titulo}
                  </h2>
                  <p className="text-zinc-800 text-base sm:text-md leading-relaxed">
                    {sec.descripcion}
                  </p>
                </div>
              </div>
            </div>

            {/* Overlay de oscurecimiento progresivo (animado por GSAP al ser cubierta) */}
            <div
              ref={el => { overlayRefs.current[i] = el }}
              className="absolute inset-0 bg-black pointer-events-none"
              style={{ opacity: 0, zIndex: 20 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
