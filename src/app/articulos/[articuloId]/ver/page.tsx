'use client'
//next
import { useParams } from "next/navigation"
//react
import { useState, useEffect } from "react";
//features
import { ArticulosService } from "@/features";

export default function VerArticulo(){
    const id_articulo = useParams<{articuloId: string}>().articuloId;
    const [articulo, setArticulo] = useState<any>(null);
    useEffect(() => {
        const fetchArticulo = async () => {
            try{
                const data = await ArticulosService.getArticuloById(id_articulo);
                setArticulo(data);
            }catch(error){
                console.log("error: " + error)
            }
        }
        fetchArticulo();
    }, [])
    return(
        <div>
            {articulo && (
                <div>
                    <h2>{articulo.titulo}</h2>  
                    <h4>{articulo.subtitulo}</h4>
                    <p>Por: {articulo.autor}</p>
                    <p>Publicado el: {new Date(articulo.fecha_publicacion).toLocaleDateString()}</p>
                    <div>
                        {articulo.sec_articulo.map((seccion: any, index: number) => (
                            <div key={index}>
                                <h3>{seccion.titulo_sec}</h3>
                                <p>{seccion.contenido_sec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}  
        </div>
    )
}