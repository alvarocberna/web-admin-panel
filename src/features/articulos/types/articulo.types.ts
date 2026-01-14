
export class CreateArticuloForm{
    "titulo": string
    "subtitulo": string
    "image_file"?: FileList
    "image_alt"?: string
    "sec_articulo": CreateSecArticuloForm[]  

}

export class CreateSecArticuloForm{
    "titulo_sec": string
    "contenido_sec": string
    "image_file"?: FileList
    "image_alt"?: string
    "image_position"?: string
}

export class UpdateArticuloForm{
    "titulo": string
    "subtitulo": string
    "image_file"?: FileList
    "image_alt"?: string
    "sec_articulo": UpdateSecArticuloForm[]  

}

export class UpdateSecArticuloForm{
    "id_sec": string
    "titulo_sec": string
    "contenido_sec": string
    "image_file"?: FileList
    "image_alt"?: string
    "image_position"?: string
}