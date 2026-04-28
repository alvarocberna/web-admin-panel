'use client'
import {ContSubSec, HeadSubSec, BodySubSec, FooterSubSec, TitleSubSec, Input, Footer} from '@/shared';
import {InicioSesionForm, NavbarInicio, PortadaInicio, ContenidoInicio} from '@/features';

export default function Home() {
  return (
    <div className="w-full h-screen flex bg-zinc-100 font-sans">
      
      <div className="w-full flex flex-col m-auto">
          <NavbarInicio/>
          <PortadaInicio/>
          <div className='h-20 bg-white'></div>
          <ContenidoInicio/>
          <div className='h-100 w-full bg-white' ></div>
          <Footer/>
      </div>
    </div>
  );
}
