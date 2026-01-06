'use client'
//react
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
//shared
import {ContenedorAdmin, TitleSec, ContSubSec, HeadSubSec, TitleSubSec, BodySubSec, FooterSubSec} from '@/shared';
//features
import {ArticulosService} from '@/features';
//fontawesome
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function Articulos(){
    //inicializar estados
    // const [flag, setFlag] = useState(false)
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

    const closeModal = () => {
        setArticleToDelete(null)
        setModalOpen(false)
    }

    //confirma la eliminación y llama al servicio
    const confirmDelete = async () => {
        if(!articleToDelete) return;
        try{
            console.log('Borrando articulo con id:', articleToDelete)
            await ArticulosService.deleteArticulo(articleToDelete)
            console.log('Articulo borrado con exito')
            setArticulos((prev: any[]) => prev.filter((a: any) => a.id !== articleToDelete))
            closeModal()
            router.refresh()
        }catch(error){
            console.error('Error borrando articulo:', error)
            closeModal()
        }
    }

    //mostramos los datos en una lista con estilos
    const listaArticulos = articulos.map((articulo: any, index: number) => {
        const fecha = new Date(articulo.fecha_publicacion);
        const anno = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        
        return(
            <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4' key={index}>
                <div className='w-full flex flex-col border border-gray-800 text-gray-800 px-2 py-3'>
                    <h4 className='mb-2 font-bold text-lg'>{articulo.titulo}</h4>
                    <p className='mb-0'>Por: {articulo.autor}</p>
                    <p className='mb-0'>Publicado: {dia}/{mes}/{anno}</p>
                    <div className='flex justify-center'>
                        <Link href={`/articulos/${articulo.id}/ver`} className='w-1/4 h-10 flex bg-cyan-600 rounded text-white hover:underline'>
                            <FontAwesomeIcon icon={faEye} className='m-auto' style={{width: '16px', height: '16px'}}/>
                        </Link>
                        <Link href={`/articulos/${articulo.id}/modificar`} className='w-1/4 h-10 flex ml-4 bg-yellow-500 rounded text-white hover:underline'>
                            <FontAwesomeIcon icon={faPencil} className='m-auto' style={{width: '16px', height: '16px'}}/>
                        </Link>
                        <button id='btnDelArt' onClick={() => openModal(articulo.id)} className='w-1/4 h-10 ml-4 bg-red-600 text-white rounded flex hover:underline'>
                            <FontAwesomeIcon icon={faTrash} className='m-auto' style={{width: '16px', height: '16px'}}/>
                        </button>
                    </div>
                </div>
            </div>
        )
    })


    return(
        <ContenedorAdmin>
            {/* <h3 className='mb-3'>Articulos</h3> */}
            <TitleSec title='Articulos'/>
            <ContSubSec>
                <HeadSubSec>
                    <Link href={'/articulos/crear'} className='h-9 flex bg-cyan-600 rounded'>
                        <button className='h-full w-full px-5 rounded'>
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

            </ContSubSec>
        </ContenedorAdmin>
    )
}