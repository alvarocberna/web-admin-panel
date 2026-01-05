'use client'
//react
import { useState, useEffect } from 'react';
//shared
import {ContenedorAdmin} from '@/shared';
//features
import { UsuarioEntity } from '@/features';
import { UsuarioService } from '@/features/usuarios/services/usuario.service';

export default function Dashboard(){
    //inicializar estados
    const [usuario, setUsuario] = useState<UsuarioEntity>()

    //traemos los articulos al cargar el componente
    useEffect(() => {
        const fetchUsuario = async () => {
            try{
                const data = await UsuarioService.getUsuario()
                setUsuario(data);
            }catch(error){
                console.log("error: " + error)
            }
        }
        fetchUsuario();
    }, [])
    
    return(
        <ContenedorAdmin>
            <p className='text-black'>
                Welcome {usuario?.email}
            </p>
        </ContenedorAdmin>
    )
}