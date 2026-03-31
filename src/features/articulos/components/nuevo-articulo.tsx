'use client'
//react
import { useForm, //contiene elementos para manejar el form
    useFieldArray, //hook para manejar array dinamico dentro de formularios
    SubmitHandler //define datos del form, ayuda al autocompletado 
    } from "react-hook-form" 
import { useState } from "react";
//Next
import {useRouter} from 'next/navigation';
import Image from "next/image";
//features
import { ArticulosService, CreateArticuloForm} from '@/features';
import { SecArticulo } from './sec-articulo';
//shared
import {InputArt, InputFile} from '@/shared';
//librerías
import {toast} from 'react-toastify'


export function NuevoArticulo(){
    //estados
    const [addSec, setAddSec] = useState(true)
    //variables
    const router = useRouter();
    //destructuring de useForm
    const {
        register, //conecta cada input al form, registrando su name y rules
        handleSubmit, //intercepta el evento submit del form. Valida los campos según las rules y luego ejecuta el callback (onSubmit)
        control, //conecta el form principal con el array dinamico
        formState: { errors } //objeto que contiene el estado del form
    } = useForm<CreateArticuloForm>({ //le dice a ts que estructura tendrá el form, osea, handleSubmit sabe que campos recibir y validar
        defaultValues: { //podemos definir un default value a cualquier campo, pero no es necesario
            sec_articulo: [] //sin un defaultValue, sec_articulo sería undefined y .map fallaría
        }
    })
    //destructuring de useFieldArray
    const { 
        fields, //array de objetos que representa el estado del array dinamico. Contiene los elementos agregados con append
        append,  //fn que agrega nuevo elemento al array dinamico
        remove  //fn que elimina elementos por índice
    } = useFieldArray({ //inicializamos useFieldArray 
        control, //conecta el array con el form principal
        name: "sec_articulo" //corresponde al campo sec_articulo de CreateArticuloForm
    });
    //fn onSubmit
    const onSubmit: SubmitHandler<CreateArticuloForm> = async (data) => {
        try{
            await ArticulosService.createArticulo(data);
            toast.success("Articulo creado");
            router.push('/articulos');
            router.refresh();
        }catch(error: any){
            toast.error(error.message || "Error al crear articulo");
        }
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="w-full m-auto">
            {/* Cabecera artículo */}
            <div className="card px-4 pt-2 pb-4">
                <InputArt
                    label="Título"
                    name="titulo"
                    type="text"
                    register={register}
                    rules={{ required: 'Titulo requerido', minLength: {value: 1, message: 'Título demasiado corto'}, maxLength: {value: 200, message: 'Título demasiado largo'} }}
                    textSize="lg"
                />
                {errors.titulo && <span className="text-red-600 text-xs mt-1 block">{errors.titulo.message}</span>}
                <InputArt
                    label="Subtítulo"
                    name="subtitulo"
                    type="text"
                    register={register}
                    rules={{ required: false, maxLength: {value: 500, message: 'Subtítulo demasiado largo'} }}
                    textSize="md"
                />
                {errors.subtitulo && <span className="text-red-600 text-xs mt-1 block">{errors.subtitulo.message}</span>}
                <InputFile
                    label="Imagen de portada"
                    name={"image_file" as any}
                    register={register}
                    rules={{ required: false }}
                    accept="image/*"
                />
                <InputArt
                    label="Texto alternativo de la imagen (Alt)"
                    name={"image_alt" as any}
                    type="text"
                    register={register}
                    rules={{ required: false, maxLength: {value: 100, message: 'Máximo 100 caracteres'} }}
                />
            </div>

            {/* Secciones del artículo */}
            <div className="space-y-0">
                {fields.map((field, index) => (
                    <div className="relative mt-3" key={field.id}>
                        <SecArticulo field={field} index={index} register={register} />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-150 text-xs font-bold"
                            title="Eliminar sección"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Agregar sección */}
            <div className="mt-3 mb-10">
                {addSec ? (
                    <button
                        type="button"
                        onClick={() => setAddSec(false)}
                        className="btn btn-outline w-full h-11 text-sm"
                    >
                        + Agregar sub sección
                    </button>
                ) : (
                    <div className="flex gap-2 border border-blue-200 bg-blue-50 rounded-xl p-3">
                        {[
                            { label: 'Sin imagen', position: 'none', preview: <div className="w-full h-full bg-zinc-300 rounded-sm" /> },
                            { label: 'Imagen izquierda', position: 'left', preview: (
                                <>
                                    <div className="w-[45%] h-full bg-zinc-400 rounded-sm overflow-hidden">
                                        <Image src="/image.png" width={100} height={100} alt="img" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-[45%] h-full bg-zinc-300 rounded-sm" />
                                </>
                            )},
                            { label: 'Imagen derecha', position: 'right', preview: (
                                <>
                                    <div className="w-[45%] h-full bg-zinc-300 rounded-sm" />
                                    <div className="w-[45%] h-full bg-zinc-400 rounded-sm overflow-hidden">
                                        <Image src="/image.png" width={100} height={100} alt="img" className="w-full h-full object-cover" />
                                    </div>
                                </>
                            )},
                            { label: 'Solo imagen', position: 'all', preview: (
                                <div className="w-full h-full bg-zinc-400 rounded-sm overflow-hidden">
                                    <Image src="/image.png" width={100} height={100} alt="img" className="w-full h-full object-cover" />
                                </div>
                            )},
                        ].map(({ label, position, preview }) => (
                            <button
                                key={position}
                                type="button"
                                onClick={() => {
                                    setAddSec(true);
                                    append({ titulo_sec: "", contenido_sec: "", image_file: undefined, image_alt: "", image_position: position });
                                }}
                                className="flex-1 flex flex-col items-center gap-1.5 group"
                                title={label}
                            >
                                <div className="w-full h-12 flex gap-1 bg-white border border-zinc-200 rounded-lg p-1.5 group-hover:border-blue-400 group-hover:bg-blue-50 transition-colors duration-150">
                                    {preview}
                                </div>
                                <span className="text-[10px] text-zinc-500 group-hover:text-blue-600">{label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
                Crear artículo
            </button>
        </form>
    )
}