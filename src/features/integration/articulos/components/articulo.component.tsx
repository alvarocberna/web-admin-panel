'use client'
//react
import { useState } from "react";
//features
import { SecArticuloEntityPublic, SecArticuloPublic, ArticuloEntityPublic } from "@/features";
import { ContenedorPagePublic } from "@/shared";

interface ArticuloPublicProps {
    dataArticulo: ArticuloEntityPublic | null
}

export function ArticuloPublic({dataArticulo}: ArticuloPublicProps){

    if (!dataArticulo) return null;

    //fecha
    const fecha = new Date(dataArticulo?.fechaPublicacion);
    const anno = fecha.getFullYear();
    const mes = (fecha.getMonth()+1).toString().padStart(2, "0");
    const dia = fecha.getDay().toString().padStart(2, "0");

    return(
        <ContenedorPagePublic>
            {dataArticulo && (
                <div className="text-texto m-auto">
                    <h3 className="text-3xl mb-2">{dataArticulo.titulo}</h3>
                    <h4 className="text-xl mb-10">{dataArticulo.subtitulo}</h4>
                    <div>
                        {dataArticulo.secArticulo.map((data: SecArticuloEntityPublic, index: number) => (
                            <SecArticuloPublic key={index} data={data} />
                        ))}
                    </div>
                    <p>Autor: {dataArticulo.autor}</p>
                    <p>Publicado el {dia}/{mes}/{anno}</p>
                </div>
            )}
        </ContenedorPagePublic>
    )
}
