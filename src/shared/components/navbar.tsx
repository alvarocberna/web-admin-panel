'use client'
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper, faClockRotateLeft, faSignOutAlt, faHouse, faPeopleGroup, faGear } from '@fortawesome/free-solid-svg-icons'
import { faMessage, faFile, faUser } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { AuthService } from "@/features/auth/services/auth.service";
import { toast } from 'react-toastify';

const navItems = [
  { nombre: "Inicio",    ruta: "/dashboard",  icon: faHouse,        match: (p: string) => p === '/dashboard' },
  { nombre: "Artículos", ruta: "/articulos",  icon: faNewspaper,    match: (p: string) => p.startsWith('/articulos') },
  { nombre: "Testimonios", ruta: "/testimonios",  icon: faMessage, match: (p: string) => p === '/testimonios' },
  { nombre: "Historial", ruta: "/actividad",  icon: faClockRotateLeft, match: (p: string) => p === '/actividad' },
  { nombre: "Usuario", ruta: "/usuario",  icon: faUser, match: (p: string) => p === '/usuario' },
  { nombre: "Equipo", ruta: "/equipo",  icon: faPeopleGroup, match: (p: string) => p.startsWith('/equipo') },
  { nombre: "Servicios", ruta: "/servicios",  icon: faGear, match: (p: string) => p.startsWith('/servicios') },
  { nombre: "Project", ruta: "/project",  icon: faFile, match: (p: string) => p === '/project' },
];

export function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      toast.success('Sesión cerrada exitosamente');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Error al cerrar sesión');
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  }

  const NavLink = ({ info, onClick }: { info: typeof navItems[0], onClick?: () => void }) => {
    const isActive = info.match(pathname);
    return (
      <li className="w-full list-none">
        <Link
          href={info.ruta}
          onClick={onClick}
          className={`
            flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150
            ${isActive
              ? 'bg-zinc-100 text-zinc-900'
              : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
            }
          `}
        >
          {isActive && (
            <span className="absolute left-0 w-0.5 h-6 bg-zinc-800 rounded-r-full" />
          )}
          <FontAwesomeIcon icon={info.icon} className="me-2.5 flex-shrink-0" style={{ width: '15px', height: '15px' }} />
          {info.nombre}
        </Link>
      </li>
    );
  };

  const LogoutItem = ({ onClick }: { onClick?: () => void }) => (
    <div
      onClick={() => { onClick?.(); logout(); }}
      className={`
        flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150
        ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'}
      `}
    >
      <FontAwesomeIcon icon={faSignOutAlt} className="me-2.5 flex-shrink-0" style={{ width: '15px', height: '15px' }} />
      {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
    </div>
  );

  return (
    <div>
      {/* ── Sidebar Escritorio ─────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen bg-white border-r border-zinc-200 fixed left-0 top-0 z-20">
        <div className="px-5 py-5 border-b border-zinc-100">
          <Link href="/dashboard" className="block">
            <span className="text-sm font-semibold text-zinc-900 tracking-tight">Panel Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5 relative">
            {navItems.map((item) => (
              <NavLink key={item.ruta} info={item} />
            ))}
          </ul>
        </nav>
        <div className="px-3 py-4 border-t border-zinc-100">
          <LogoutItem />
        </div>
      </aside>

      {/* ── Topbar Móvil (cerrado) ─────────────────────── */}
      <div className="flex md:hidden items-center justify-between bg-white border-b border-zinc-200 px-4 py-3 fixed top-0 left-0 right-0 z-30">
        <Link href="/dashboard">
          <span className="text-sm font-semibold text-zinc-900">Panel Admin</span>
        </Link>
        <button
          className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Drawer Móvil (abierto) ─────────────────────── */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[72vw] max-w-xs bg-white border-r border-zinc-200 z-50
          transform transition-transform duration-200 ease-out md:hidden
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-900">Panel Admin</span>
          <button
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="px-3 py-4 relative">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink key={item.ruta} info={item} onClick={() => setOpen(false)} />
            ))}
          </ul>
        </nav>
        <div className="px-3 py-4 border-t border-zinc-100 absolute bottom-0 left-0 right-0">
          <LogoutItem onClick={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
