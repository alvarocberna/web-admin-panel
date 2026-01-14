'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faNewspaper, faUser, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";
import { AuthService } from "@/features/auth/services/auth.service";

export function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const logout = async () => {
      AuthService.logout(); 
      router.push('/')
  }

  // categorías del menú
  const navInfo = [
    { nombre: "Home", ruta: "/dashboard", icon: faHome },
    { nombre: "Articulos", ruta: "/articulos", icon: faNewspaper },
    { nombre: "Historial", ruta: "/actividad", icon: faUser },
  ];

  // Componente con la lista de opciones del menú
  const navList = navInfo.map((info, index) => (
    <li key={index} className="w-full">
      <Link
        href={info.ruta}
        className="flex items-center py-3 px-4 text-zinc-700 hover:text-sky-600 transition-colors duration-300"
        onClick={() => setOpen(false)}
      >
        <FontAwesomeIcon icon={info.icon} className="me-2" style={{width: '16px', height: '16px'}}/>
        <p className=" mb-0">
          {info.nombre}
        </p>
      </Link>
    </li>
  ));

  return (
    <div className="">
      {/* Menu Escritorio */}
      <div className="hidden md:flex flex-col w-[280px] h-screen bg-white border-r border-gray-300 fixed left-0 top-0 z-20">
        {/* Logo */}
        <div className="p-6 border-b border-gray-300">
          <Link href="/pacientes" style={{textDecoration: 'none'}}>
            <p className="font-bold text-zinc-700">
              Admin
            </p>
          </Link>
        </div>
        {/* Opciones menú */}
        <nav className="p-6 flex-1">
          <ul className="space-y-4 px-0">
            {/* lista de opciones */}
            {navList}
            {/* logout */}
            <div onClick={() => logout()}
                className="flex items-center py-3 px-4 text-zinc-700 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
            >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{width: '16px', height: '16px'}}/>
                <p className="mb-0">
                  Logout
                </p>
            </div>
          </ul>
        </nav>
      </div>

      {/* Menu Movil - cerrado*/}
      <div className="flex md:hidden items-center justify-between bg-white border-b border-gray-300 px-4 py-3 fixed top-0 left-0 right-0 z-30">
        <Link href="/pacientes">
          <h1 className="text-xl font-bold text-zinc-700">Admin</h1>
        </Link>
        <button
          className="p-2 rounded focus:outline-none focus:ring-2 text-zinc-700 focus:ring-zinc-500"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setOpen(false)} />
      )}

      {/*Menu Movil - Abierto*/}
      <div
        className={`fixed top-0 left-0 h-full w-[75vw] max-w-xs bg-white border-r border-gray-300 z-50 transform transition-transform duration-200 ease-in-out md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ boxShadow: open ? "2px 0 8px rgba(0,0,0,0.08)" : undefined }}
      >
        <div className="p-6 border-b border-gray-300 flex items-center justify-between">
          <Link href="/pacientes">
            <h1 className="text-xl font-bold text-zinc-700">Admin</h1>
          </Link>
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-zinc-500"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-6">
          <ul className="space-y-4 px-0">{navList}</ul>
        </nav>
      </div>
    </div>
  );
}