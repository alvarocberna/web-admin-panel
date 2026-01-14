'use client'
//react
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
//shared
import {ContenedorAdmin, TitleSec, HeadSubSec} from '@/shared';
//features
import {ArticulosService, ArticuloEntity} from '@/features';
//fontawesome
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function Articulos(){
    //inicializar estados y variables
    const [articulos, setArticulos] = useState<any>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
    const router = useRouter();

    //traemos los articulos al cargar el componente
    useEffect(() => {
        const fetchArticulos = async () => {
            try{
                const data = await ArticulosService.getArticulos();
                setArticulos(data);
            }catch(error){
                console.log("error: " + error)
            }
        }
        fetchArticulos();
    }, [articulos.length]);

    //abre el modal de confirmación
    const openModal = (id: string) => {
        setArticleToDelete(id)
        setModalOpen(true)
    }

    //cierra el modal de confirmación
    const closeModal = () => {
        setArticleToDelete(null)
        setModalOpen(false)
    }

    //confirma la eliminación y llama al servicio
    const confirmDelete = async () => {
        if(!articleToDelete) return;
        try{
            await ArticulosService.deleteArticulo(articleToDelete)
            setArticulos((prev: any[]) => prev.filter((a: any) => a.id !== articleToDelete))
            closeModal()
            router.refresh()
        }catch(error){
            console.error('Error borrando articulo:', error)
            closeModal()
        }
    }

    //componente con todos los articulos
    const listaArticulos = articulos.map((articulo: ArticuloEntity, index: number) => {
        const fecha = new Date(articulo.fecha_publicacion);
        const anno = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        return(
            <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4' key={index}>
                <div className='w-full flex flex-col bg-white border border-gray-200 rounded-xl text-black px-5 py-5'>
                    <h4 className='mb-2 font-bold text-lg'>{articulo.titulo}</h4>
                    <p className='mb-2'>Por: {articulo.autor}</p>
                    <p className='mb-5'>Publicado: {dia}/{mes}/{anno}</p>
                    <div className='flex justify-between'>
                        <Link href={`/articulos/${articulo.id}/ver`} 
                            className='w-[30%] h-12 flex bg-zinc-100 border border-zinc-300 rounded-md text-zinc-600 hover:text-green-600 transition'
                        >
                            <FontAwesomeIcon icon={faEye} className='m-auto ' style={{width: '24px', height: '24px'}}/>
                        </Link>
                        <Link href={`/articulos/${articulo.id}/modificar`} 
                            className='w-[30%] h-12 flex bg-zinc-100 border border-zinc-300 rounded-md text-zinc-600 hover:text-yellow-600 transition'
                        >
                            <FontAwesomeIcon icon={faPencil} className='m-auto' style={{width: '40px', height: '24px'}}/>
                        </Link>
                        <button id='btnDelArt' onClick={() => openModal(articulo.id)} 
                            className='w-[30%] flex h-12 bg-zinc-100 border border-zinc-300 rounded-md  text-zinc-600 hover:text-red-600 transition'>
                            <FontAwesomeIcon icon={faTrash} className='m-auto' style={{width: '24px', height: '24px'}}/>
                        </button>
                    </div>
                </div>
            </div>
        )
    })

    return(
        <ContenedorAdmin>
            <TitleSec title='Articulos'/>
                <HeadSubSec>
                    <Link href={'/articulos/crear'} className='h-10 rounded-3xl bg-black'>
                        <button className='h-full w-full px-5 text-white'>
                            Nuevo Articulo
                        </button>
                    </Link>
                </HeadSubSec>
                <div className='flex flex-wrap -mx-2 pb-10'>
                    {listaArticulos}
                </div>

                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="bg-white text-black p-6 rounded shadow-lg w-11/12 max-w-md border border-cyan-700">
                            <p className="mb-4">¿seguro que deseas borrar este articulo?</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">si</button>
                                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">no</button>
                            </div>
                        </div>
                    </div>
                )}

        </ContenedorAdmin>
    )
}