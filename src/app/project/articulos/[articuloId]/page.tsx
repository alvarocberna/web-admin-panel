'use client'
//next
import { useParams } from "next/navigation"
//react
import { useState, useEffect } from "react";
//features
import { ArticulosService, SecArticuloEntity, SecArticulo } from "@/features/project";
import { ContenedorPage } from "@/shared/project";

export default function VerArticulo(){
    const id_articulo = useParams<{articuloId: string}>().articuloId;
    const [articulo, setArticulo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticulo = async () => {
            try{
                const data = await ArticulosService.getArticuloById(id_articulo);
                setArticulo(data);
            }catch(error){
                console.log("error: " + error)
            }finally{
                setLoading(false);
            }
        }
        fetchArticulo();
    }, [])

    if(loading){
        return(
            <div className="w-full h-[90vh] flex justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }
    //fecha
    const fecha = new Date(articulo?.fecha_publicacion);
    const anno = fecha.getFullYear();
    const mes = (fecha.getMonth()+1).toString().padStart(2, "0");
    const dia = fecha.getDay().toString().padStart(2, "0");

    return(
        <ContenedorPage>
            {articulo && (
                <div className="text-black m-auto">
                    <h3 className="text-3xl mb-2">{articulo.titulo}</h3>
                    <h4 className="text-xl mb-10">{articulo.subtitulo}</h4>
                    <div>
                        {articulo.sec_articulo.map((data: SecArticuloEntity, index: number) => (
                            <SecArticulo key={index} data={data} />
                        ))}
                    </div>
                    <p>Autor: {articulo.autor}</p>
                    <p>Publicado el {dia}/{mes}/{anno}</p>
                </div>
            )}  
        </ContenedorPage>
    )
}