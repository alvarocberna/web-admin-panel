'use client'
import {ContSubSec, HeadSubSec, BodySubSec, FooterSubSec, TitleSubSec, Input} from '@/shared';
import {InicioSesionForm} from '@/features';

export default function Home() {
  return (
    <div className="w-full h-screen flex bg-zinc-100 font-sans">
      <div className="w-1/3 flex m-auto">
        <ContSubSec width='90%'>
          <HeadSubSec>
            <TitleSubSec title="Inicio de Sesión"/>
          </HeadSubSec>
            <InicioSesionForm />
        </ContSubSec>
      </div>
    </div>
  );
}
