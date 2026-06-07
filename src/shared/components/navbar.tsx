'use client'
//NEXT
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
//REACT
import { useState } from "react";
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper, faClockRotateLeft, faSignOutAlt, faHouse, faPeopleGroup, faGear, faUsers, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { faMessage, faFile, faUser } from "@fortawesome/free-regular-svg-icons";
//TOASTIFY
import { toast } from 'react-toastify';
//FEATURRES
import { AuthService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/features/auth/store/auth.store";


const navItems = [
  { nombre: "Inicio",      ruta: "/dashboard",  icon: faHouse,           match: (p: string) => p === '/dashboard',         roles: ['USER', 'ADMIN', 'SUPERADMIN'] },
  { nombre: "Equipo",      ruta: "/equipo",      icon: faPeopleGroup,     match: (p: string) => p.startsWith('/equipo'),     roles: ['ADMIN', 'SUPERADMIN'] },
  { nombre: "Servicios",   ruta: "/servicios",   icon: faGear,            match: (p: string) => p.startsWith('/servicios'),  roles: ['ADMIN', 'SUPERADMIN'] },
  { nombre: "Artículos",   ruta: "/articulos",   icon: faNewspaper,       match: (p: string) => p.startsWith('/articulos'), roles: ['USER', 'ADMIN', 'SUPERADMIN'] },
  { nombre: "Testimonios", ruta: "/testimonios", icon: faMessage,         match: (p: string) => p === '/testimonios',        roles: ['ADMIN', 'SUPERADMIN'] },
  { nombre: "Usuarios",    ruta: "/usuarios",    icon: faUsers,           match: (p: string) => p.startsWith('/usuarios'),   roles: ['ADMIN', 'SUPERADMIN'] },
  { nombre: "Historial",   ruta: "/actividad",   icon: faClockRotateLeft, match: (p: string) => p === '/actividad',          roles: ['ADMIN', 'SUPERADMIN'] },
  { nombre: "Perfil",      ruta: "/perfil",     icon: faUser,            match: (p: string) => p === '/perfil',            roles: ['USER', 'ADMIN', 'SUPERADMIN'] },
  { nombre: "Project",     ruta: "/project",     icon: faFile,            match: (p: string) => p === '/project',            roles: ['SUPERADMIN'] },
  { nombre: "Superadmin",  ruta: "/superadmin",  icon: faLayerGroup,      match: (p: string) => p.startsWith('/superadmin'), roles: ['SUPERADMIN'] },
];

export function NavbarAdmin() {
  //estados
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  //variables
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  //filtra los navItems segun rol
  const visibleItems = navItems.filter(item =>
    user?.rol ? item.roles.includes(user.rol) : false
  );

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
      clearAuth();
      toast.success('Sesión cerrada exitosamente');
      router.push('/');
    } catch (error: any) {
      clearAuth();
      toast.error(error.message || 'Error al cerrar sesión');
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  }

  //componente NavLink
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

  //componente btn logout
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
      {/* ── Barra lateal (escritorio) ─────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen bg-white border-r border-zinc-200 fixed left-0 top-0 z-20">
        {/* dashboard - lo muestra siemprre si o si */}
        <div className="px-5 py-5 border-b border-zinc-100">
          <Link href="/dashboard" className="block">
            <span className="text-sm font-semibold text-zinc-900 tracking-tight">Panel Admin</span>
          </Link>
        </div>
        {/* navlinks según rol */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5 relative">
            {visibleItems.map((item) => (
              <NavLink key={item.ruta} info={item} />
            ))}
          </ul>
        </nav>
        {/* logount button */}
        <div className="px-3 py-4 border-t border-zinc-100">
          <LogoutItem />
        </div>
      </aside>

      {/* ── Navbar Móvil (cerrado) ─────────────────────── */}
      <div className="flex md:hidden items-center justify-between bg-white border-b border-zinc-200 px-4 py-3 fixed top-0 left-0 right-0 z-30">
        {/* dashboard */}
        <Link href="/dashboard">
          <span className="text-sm font-semibold text-zinc-900">Panel Admin</span>
        </Link>
        {/* button abrir menu */}
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
        {/* header del navbar vista movil */}
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
        {/* navlink según rol */}
        <nav className="px-3 py-4 relative">
          <ul className="space-y-0.5">
            {visibleItems.map((item) => (
              <NavLink key={item.ruta} info={item} onClick={() => setOpen(false)} />
            ))}
          </ul>
        </nav>
        {/* logount button */}
        <div className="px-3 py-4 border-t border-zinc-100 absolute bottom-0 left-0 right-0">
          <LogoutItem onClick={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
