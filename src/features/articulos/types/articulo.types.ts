
export class CreateArticuloForm{
    "titulo": string
    "subtitulo": string
    "sec_articulo": CreateSecArticuloForm[]  

}

export class CreateSecArticuloForm{
    "titulo_sec": string
    "contenido_sec": string
}

export class UpdateArticuloForm{
    "titulo": string
    "subtitulo": string
    "sec_articulo": UpdateSecArticuloForm[]  

}

export class UpdateSecArticuloForm{
    "titulo_sec": string
    "contenido_sec": string
}