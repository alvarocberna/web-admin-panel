'use client'
//react
import { useState } from "react";
//features
import { SecArticuloEntity, SecArticulo, ArticuloEntity } from "@/features/project";
import { ContenedorPage } from "@/shared/project";

interface ArticuloPublicProps {
    dataArticulo: ArticuloEntity | null
}

export function ArticuloPublic({dataArticulo}: ArticuloPublicProps){

    if (!dataArticulo) return null;

    //fecha
    const fecha = new Date(dataArticulo?.fecha_publicacion);
    const anno = fecha.getFullYear();
    const mes = (fecha.getMonth()+1).toString().padStart(2, "0");
    const dia = fecha.getDay().toString().padStart(2, "0");

    return(
        <ContenedorPage>
            {dataArticulo && (
                <div className="text-black m-auto">
                    <h3 className="text-3xl mb-2">{dataArticulo.titulo}</h3>
                    <h4 className="text-xl mb-10">{dataArticulo.subtitulo}</h4>
                    <div>
                        {dataArticulo.sec_articulo.map((data: SecArticuloEntity, index: number) => (
                            <SecArticulo key={index} data={data} />
                        ))}
                    </div>
                    <p>Autor: {dataArticulo.autor}</p>
                    <p>Publicado el {dia}/{mes}/{anno}</p>
                </div>
            )}
        </ContenedorPage>
    )
}
