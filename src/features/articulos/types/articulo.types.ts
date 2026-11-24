
export class CreateArticuloForm{
    "titulo": string
    "subtitulo": string
    "imageFile"?: FileList
    "imageAlt"?: string
    "secArticulo": CreateSecArticuloForm[]  

}

export class CreateSecArticuloForm{
    "tituloSec": string
    "contenidoSec": string
    "imageFile"?: FileList
    "imageAlt"?: string
    "imagePosition"?: string
}

export class UpdateArticuloForm{
    "titulo": string
    "subtitulo": string
    "activo"?: boolean
    "imageUrl"?: string | null
    "imageFile"?: FileList
    "imageAlt"?: string
    "secArticulo": UpdateSecArticuloForm[]

}

export class UpdateSecArticuloForm{
    "idSec": string
    "tituloSec": string
    "contenidoSec": string
    "imageUrl"?: string | null
    "imageFile"?: FileList
    "imageAlt"?: string
    "imagePosition"?: string
}