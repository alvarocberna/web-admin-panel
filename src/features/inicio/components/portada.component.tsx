'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

// ── Constants ─────────────────────────────────────────────────
const VIEWS = ['dashboard', 'equipo', 'servicios', 'articulos', 'testimonios', 'usuarios', 'historial', 'perfil'] as const
type ViewId = (typeof VIEWS)[number]

const NAV_ITEMS = [
  { label: 'Inicio',      id: 'dashboard',   icon: 'house'      },
  { label: 'Equipo',      id: 'equipo',       icon: 'people'     },
  { label: 'Servicios',   id: 'servicios',    icon: 'gear'       },
  { label: 'Artículos',   id: 'articulos',    icon: 'newspaper'  },
  { label: 'Testimonios', id: 'testimonios',  icon: 'message'    },
  { label: 'Usuarios',    id: 'usuarios',     icon: 'users'      },
  { label: 'Historial',   id: 'historial',    icon: 'clock'      },
  { label: 'Perfil',      id: 'perfil',       icon: 'user'       },
]

const FEATURES = [
  'Gestión de contenido centralizada',
  'Control de usuarios y roles',
  'Moderación de testimonios',
  'Blog integrado de artículos',
]

// ── Tiny icon ─────────────────────────────────────────────────
function Icon({ name, size = 10 }: { name: string; size?: number }) {
  const s = { width: size, height: size, flexShrink: 0 as const }
  const paths: Record<string, React.ReactNode> = {
    house: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
    people: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
    gear: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
    newspaper: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    ),
    message: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    clock: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    logout: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    ),
    lock: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    ),
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={s}>
      {paths[name]}
    </svg>
  )
}

// ── Dark sidebar ──────────────────────────────────────────────
function FakeSidebar({ active }: { active: string }) {
  return (
    <aside style={{
      width: '128px',
      background: '#0d0e18',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#e4e4e7', letterSpacing: '-0.01em' }}>
          Panel Admin
        </span>
      </div>

      <nav style={{ flex: 1, padding: '6px', overflow: 'hidden' }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.id === active
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '5px 8px',
                borderRadius: '5px',
                marginBottom: '1px',
                fontSize: '9.5px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f4f4f5' : '#52525b',
                background: isActive ? 'rgba(179,172,255,0.12)' : 'transparent',
                position: 'relative',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2px',
                  height: '16px',
                  background: '#b3acff',
                  borderRadius: '0 2px 2px 0',
                }} />
              )}
              <span style={{ color: isActive ? '#b3acff' : '#3f3f46' }}>
                <Icon name={item.icon} size={10} />
              </span>
              {item.label}
            </div>
          )
        })}
      </nav>

      <div style={{ padding: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '5px 8px', fontSize: '9.5px', color: '#3f3f46', borderRadius: '5px',
        }}>
          <Icon name="logout" size={10} />
          Cerrar sesión
        </div>
      </div>
    </aside>
  )
}

// ── Dashboard view ────────────────────────────────────────────
function DashboardContent() {
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '9px' }}>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '12px 14px' }}>
        <p style={{ fontSize: '7px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>Bienvenido</p>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#18181b' }}>Carlos García</p>
        <p style={{ fontSize: '9px', color: '#71717a', marginTop: '2px' }}>carlos.garcia@empresa.com</p>
      </div>

      <div>
        <p style={{ fontSize: '7px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>Proyecto</p>
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '10px 14px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#18181b' }}>Mi Empresa Web</p>
          <p style={{ fontSize: '9px', color: '#71717a', marginTop: '3px' }}>
            Estado: <span style={{ color: '#16a34a', fontWeight: 500 }}>Activo</span>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '7px' }}>
        {[
          { label: 'Equipo',      val: '4 empleados'  },
          { label: 'Servicios',   val: '6 servicios'  },
          { label: 'Artículos',   val: '12 artículos' },
          { label: 'Testimonios', val: '3 pendientes' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '9px 12px' }}>
            <p style={{ fontSize: '9px', fontWeight: 600, color: '#18181b', marginBottom: '3px' }}>{s.label}</p>
            <p style={{ fontSize: '8px', color: '#71717a' }}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Equipo view ───────────────────────────────────────────────
function EquipoContent() {
  const members = [
    { name: 'Ana Martínez',   role: 'Diseñadora UX',  initials: 'AM', color: '#818cf8' },
    { name: 'Pedro López',    role: 'Desarrollador',   initials: 'PL', color: '#34d399' },
    { name: 'María Sánchez',  role: 'Marketing',       initials: 'MS', color: '#f472b6' },
    { name: 'Luis Torres',    role: 'Gerente General', initials: 'LT', color: '#fbbf24' },
  ]
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#18181b' }}>Equipo</p>
        <div style={{ background: '#18181b', color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '9px', fontWeight: 500 }}>
          + Añadir
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {members.map(m => (
          <div key={m.name} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {m.initials}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#18181b' }}>{m.name}</p>
              <p style={{ fontSize: '8px', color: '#71717a', marginTop: '1px' }}>{m.role}</p>
            </div>
            <span style={{ fontSize: '9px', color: '#a1a1aa' }}>Editar</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Testimonios view ──────────────────────────────────────────
function TestimoniosContent() {
  const items = [
    { name: 'Roberto Gómez', text: 'Excelente servicio, muy recomendado para cualquier proyecto web.', date: '12 May 2026', status: 'pendiente' },
    { name: 'Laura Vera',    text: 'El equipo fue muy profesional. Estoy muy satisfecha con los resultados.', date: '10 May 2026', status: 'aprobado'  },
    { name: 'Jorge Ibáñez',  text: 'Increíble experiencia, los resultados superaron mis expectativas.', date: '08 May 2026', status: 'pendiente' },
  ]
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#18181b', marginBottom: '10px' }}>Testimonios</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {items.map(t => (
          <div key={t.name} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '10px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 600, color: '#18181b' }}>{t.name}</p>
                <p style={{ fontSize: '8px', color: '#a1a1aa', marginTop: '1px' }}>{t.date}</p>
              </div>
              <span style={{
                fontSize: '8px', fontWeight: 500, borderRadius: '20px', padding: '2px 8px',
                background: t.status === 'aprobado' ? '#dcfce7' : '#fef3c7',
                color:      t.status === 'aprobado' ? '#16a34a' : '#d97706',
                flexShrink: 0, marginLeft: '8px',
              }}>
                {t.status === 'aprobado' ? 'Aprobado' : 'Pendiente'}
              </span>
            </div>
            <p style={{ fontSize: '9px', color: '#52525b', lineHeight: 1.5 }}>{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Usuarios view ─────────────────────────────────────────────
function UsuariosContent() {
  const users = [
    { name: 'Carlos García', email: 'carlos@empresa.com', rol: 'SUPERADMIN' },
    { name: 'Ana Martínez',  email: 'ana@empresa.com',    rol: 'ADMIN'      },
    { name: 'Pedro López',   email: 'pedro@empresa.com',  rol: 'USER'       },
  ]
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#18181b' }}>Usuarios</p>
        <div style={{ background: '#18181b', color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '9px', fontWeight: 500 }}>
          + Invitar
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.7fr 0.5fr', padding: '7px 14px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#fafafa' }}>
          {['Nombre', 'Email', 'Rol', ''].map(h => (
            <span key={h} style={{ fontSize: '7px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>
        {users.map((u, i) => (
          <div key={u.email} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.7fr 0.5fr', padding: '9px 14px', borderBottom: i < users.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 500, color: '#18181b' }}>{u.name}</span>
            <span style={{ fontSize: '9px', color: '#71717a' }}>{u.email}</span>
            <span style={{ fontSize: '8px', fontWeight: 500, borderRadius: '20px', padding: '2px 8px', background: '#f4f4f5', color: '#52525b', display: 'inline-block' }}>{u.rol}</span>
            <span style={{ fontSize: '9px', color: '#a1a1aa' }}>Editar</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Artículos view ────────────────────────────────────────────
function ArticulosContent() {
  const articles = [
    { title: 'Tendencias en diseño web 2026',          autor: 'Ana M.',   date: '14 May', status: 'publicado' },
    { title: 'Cómo optimizar tu sitio para SEO',       autor: 'Pedro L.', date: '10 May', status: 'publicado' },
    { title: 'Guía de accesibilidad digital',          autor: 'Ana M.',   date: '05 May', status: 'borrador'  },
    { title: 'Introducción a Progressive Web Apps',    autor: 'Pedro L.', date: '01 May', status: 'publicado' },
  ]
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#18181b' }}>Artículos</p>
        <div style={{ background: '#18181b', color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '9px', fontWeight: 500 }}>
          + Nuevo
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {articles.map(a => (
          <div key={a.title} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth={1.5} style={{ width: '13px', height: '13px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
              <p style={{ fontSize: '8px', color: '#a1a1aa', marginTop: '2px' }}>{a.autor} · {a.date}</p>
            </div>
            <span style={{
              fontSize: '8px', fontWeight: 500, borderRadius: '20px', padding: '2px 8px', flexShrink: 0,
              background: a.status === 'publicado' ? '#dcfce7' : '#f4f4f5',
              color:      a.status === 'publicado' ? '#16a34a' : '#71717a',
            }}>
              {a.status === 'publicado' ? 'Publicado' : 'Borrador'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Servicios view ────────────────────────────────────────────
function ServiciosContent() {
  const services = [
    { title: 'Desarrollo Web',      desc: 'Sitios modernos y responsivos a medida.', color: '#818cf8' },
    { title: 'Diseño UX/UI',        desc: 'Interfaces intuitivas centradas en el usuario.', color: '#34d399' },
    { title: 'SEO & Marketing',     desc: 'Posicionamiento y estrategias digitales.', color: '#f472b6' },
    { title: 'Soporte Técnico',     desc: 'Mantenimiento y asistencia continua.', color: '#fbbf24' },
  ]
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#18181b' }}>Servicios</p>
        <div style={{ background: '#18181b', color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '9px', fontWeight: 500 }}>
          + Añadir
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
        {services.map(s => (
          <div key={s.title} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#18181b', marginBottom: '3px' }}>{s.title}</p>
            <p style={{ fontSize: '8px', color: '#71717a', lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Historial view ────────────────────────────────────────────
function HistorialContent() {
  const events = [
    { user: 'Ana M.',    action: 'creó el artículo',       target: '"Tendencias 2026"',         time: 'hace 5 min',  color: '#818cf8' },
    { user: 'Carlos G.', action: 'aprobó el testimonio de', target: 'Laura Vera',               time: 'hace 18 min', color: '#34d399' },
    { user: 'Pedro L.',  action: 'editó el servicio',       target: '"Desarrollo Web"',          time: 'hace 1 h',    color: '#fbbf24' },
    { user: 'Ana M.',    action: 'añadió al equipo a',      target: 'María Sánchez',             time: 'hace 2 h',    color: '#818cf8' },
    { user: 'Carlos G.', action: 'invitó al usuario',       target: 'pedro@empresa.com',         time: 'hace 3 h',    color: '#34d399' },
  ]
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#18181b', marginBottom: '10px' }}>Historial de actividad</p>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', borderBottom: i < events.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: e.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: e.color }} />
            </div>
            <p style={{ flex: 1, fontSize: '9px', color: '#52525b', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: '#18181b' }}>{e.user}</span>
              {' '}{e.action}{' '}
              <span style={{ fontWeight: 500, color: '#18181b' }}>{e.target}</span>
            </p>
            <span style={{ fontSize: '8px', color: '#a1a1aa', flexShrink: 0 }}>{e.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Perfil view ───────────────────────────────────────────────
function PerfilContent() {
  return (
    <div style={{ flex: 1, background: '#f4f4f5', padding: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '9px' }}>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', padding: '16px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#d2ceff,#ada5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          CG
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#18181b' }}>Carlos García</p>
          <p style={{ fontSize: '9px', color: '#71717a', marginTop: '2px' }}>carlos.garcia@empresa.com</p>
          <span style={{ fontSize: '8px', fontWeight: 500, borderRadius: '20px', padding: '1px 7px', background: '#ede9fe', color: '#7c3aed', display: 'inline-block', marginTop: '4px' }}>
            SUPERADMIN
          </span>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '9px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Información personal</p>
          {[
            { label: 'Nombre',   val: 'Carlos' },
            { label: 'Apellido', val: 'García' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '9px', color: '#71717a' }}>{f.label}</span>
              <span style={{ fontSize: '9px', fontWeight: 500, color: '#18181b' }}>{f.val}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px' }}>
          <p style={{ fontSize: '9px', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Seguridad</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: '#71717a' }}>Contraseña</span>
            <div style={{ background: '#18181b', color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '9px', fontWeight: 500 }}>
              Cambiar
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export function PortadaInicio() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const viewRefs      = useRef<(HTMLDivElement | null)[]>([])
  const currentIdx    = useRef(0)
  const isAnimating   = useRef(false)
  const [activeView, setActiveView] = useState(0)

  useGSAP(() => {
    viewRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { y: i === 0 ? '0%' : '100%' })
    })
  }, { scope: containerRef })

  useEffect(() => {
    const tick = () => {
      if (isAnimating.current) return
      const views = viewRefs.current.filter(Boolean) as HTMLDivElement[]
      if (views.length < 2) return

      isAnimating.current = true
      const cur  = currentIdx.current
      const next = (cur + 1) % views.length

      setActiveView(next)

      gsap.to(views[cur], {
        y: '-100%',
        duration: 0.85,
        ease: 'power2.inOut',
      })
      gsap.fromTo(
        views[next],
        { y: '100%' },
        {
          y: '0%',
          duration: 0.85,
          ease: 'power2.inOut',
          onComplete: () => { isAnimating.current = false },
        }
      )

      currentIdx.current = next
    }

    const id = setInterval(tick, 3600)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="min-h-screen w-full flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eef1ff 100%)' }}>
      <div className="w-full max-w-7xl mx-auto px-6 py-20 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* ── Left — 40% ───────────────────────────────────── */}
        <div className="w-full lg:w-[40%] flex flex-col gap-8">

          <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full border border-[#835ef5]/25 bg-[#835ef5]/8 text-[#835ef5] text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#835ef5] animate-pulse" />
            CMS personalizado
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-zinc-900">
            Tu sitio web<br />
            en{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #835ef5 55%, #6d3ee8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              tus manos
            </span>
          </h1>

          <p className="text-zinc-500 text-base leading-relaxed">
            Administra el contenido de tu sitio web de forma simple e intuitiva. Sin conocimientos técnicos, todo desde un solo lugar.
          </p>

          <ul className="flex flex-col gap-3">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3 text-zinc-700 text-sm">
                <span className="w-5 h-5 rounded-full bg-[#835ef5]/10 border border-[#835ef5]/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#835ef5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right — 60% ──────────────────────────────────── */}
        <div className="w-full lg:w-[60%]">

          {/* Browser chrome */}
          <div
            className="rounded-xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.10)' }}
          >
            {/* Title bar */}
            <div style={{ background: '#13141f', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '5px', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth={2} style={{ width: '8px', height: '8px', flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span style={{ fontSize: '9px', color: '#52525b' }}>
                  app.misitio.com/{VIEWS[activeView]}
                </span>
              </div>
            </div>

            {/* Fake UI viewport */}
            <div
              ref={containerRef}
              style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden' }}
            >
              {VIEWS.map((view, i) => (
                <div
                  key={view}
                  ref={el => { viewRefs.current[i] = el }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    transform: i === 0 ? 'translateY(0%)' : 'translateY(100%)',
                  }}
                >
                  <FakeSidebar active={view} />
                  {view === 'dashboard'   && <DashboardContent />}
                  {view === 'equipo'      && <EquipoContent />}
                  {view === 'servicios'   && <ServiciosContent />}
                  {view === 'articulos'   && <ArticulosContent />}
                  {view === 'testimonios' && <TestimoniosContent />}
                  {view === 'usuarios'    && <UsuariosContent />}
                  {view === 'historial'   && <HistorialContent />}
                  {view === 'perfil'      && <PerfilContent />}
                </div>
              ))}
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {VIEWS.map((v, i) => (
              <div
                key={v}
                style={{
                  height: '5px',
                  borderRadius: '9999px',
                  width: i === activeView ? '22px' : '5px',
                  background: i === activeView ? '#835ef5' : 'rgba(131,94,245,0.18)',
                  transition: 'all 0.35s ease',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
