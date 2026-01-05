
export interface NuevoArticuloInterface{
    titulo: string
    subtitulo: string
    secArticulo: NuevaSecArticuloInterface[]
}

// export interface ModificarArticuloInterface{
//     titulo: string
//     subtitulo: string
//     secArticulo: NuevaSecArticuloInterface[]
// }

export interface NuevaSecArticuloInterface{
    tituloSec: string
    contenidoSec: string
}

// export interface ModificarSecArticuloInterface{
//     tituloSec: string
//     contenidoSec: string
// }