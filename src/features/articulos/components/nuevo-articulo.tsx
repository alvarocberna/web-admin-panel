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
    const onSubmit: SubmitHandler<CreateArticuloForm> = (data) => {
        try{
            ArticulosService.createArticulo(data);
            toast.success("Articulo creado");
            router.push('/articulos');
        }catch(error: any){
            toast.error(error.message || "Error al crear articulo");
        }
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="w-full m-auto">
            {/* Cabecera articulo */}
            <div className="bg-white border border-gray-200 rounded-xl px-2 pt-1 pb-3">
                <InputArt 
                label="Titulo" 
                name="titulo" 
                type="text" 
                register={register} 
                rules={{ required: true, minLength: {value: 1, message: 'Titulo demasiado corto'}, maxLength: {value: 50, message: 'Titulo demasiado largo'} }} 
                textSize="lg"/>
                {errors.titulo && <span className="text-red-700 text-sm">{errors.titulo.message}</span>}
                <InputArt 
                label="Subtitulo" 
                name="subtitulo" 
                type="text" 
                register={register} 
                rules={{ required: false, minLength: {value: 1, message: 'Subtitulo demasiado corto'}, maxLength: {value: 200, message: 'Subtitulo demasiado largo'} }} 
                textSize="md"/>
                {errors.subtitulo && <span className="text-red-700 text-sm">{errors.subtitulo.message}</span>}
                <InputFile
                label={''}
                name={`image_file` as any}
                register={register}
                rules={{ required: false }}
                accept="image/*"
                />
                <InputArt
                label={`Texto alternativo de la imagen (Alt)`}
                name={`image_alt` as any}
                type="text"
                register={register}
                rules={{ required: false }}
                />
            </div>
            {/* Secciones articulo */}
            <div>
                {fields.map((field, index) => (
                    <div className="relative" key={index}>
                        {/* Sec Articulo */}
                        <SecArticulo key={field.id} field={field} index={index} register={register} />
                        {/* Btn eliminar sec */}
                        <button type="button" onClick={() => remove(index)}
                            className="absolute top-0 right-0 w-6 h-6 m-auto flex justify-center bg-red-700 rounded-md hover:bg-red-600 transition-colors duration-300 cursor-pointer">
                                X
                        </button>
                    </div>
                    
                ))}
            </div>
            {/* Agregar nuevo articulo */}
            <div className="mt-1 mb-10">
                {
                    addSec ?
                <button
                type="button"
                onClick={() => {setAddSec(!addSec)}}
                className="w-full h-12 bg-transparent border border-sky-600 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors duration-300 cursor-pointer">
                    Agregar Sub Sección
                </button>
                :
                <div className="h-20 flex border border-sky-500 rounded-xl">
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({ titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "none" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[80%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden me-1">
                            </div>
                        </button>
                    </div>
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({ titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "left" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden me-1">
                                <Image src='/image.png' width={100} height={100} alt="image" className="w-full h-full object-cover"></Image>
                            </div>
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden">
                            </div>
                        </button>
                    </div>
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({ titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "right" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden me-1">
                            </div>
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden">
                                <Image src='/image.png' width={100} height={100} alt="image" className="w-full h-full object-cover"></Image>
                            </div>
                        </button>
                    </div>
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({ titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "all" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[80%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden">
                                <Image src='/image.png' width={100} height={100} alt="image" className="w-full h-full object-cover"></Image>
                            </div>
                        </button>
                    </div>
                </div>
                }
            </div>
            <input type='submit' value='Crear Articulo' 
            className="bg-sky-700 hover:bg-sky-600 transition-colors duration-300 cursor-pointer px-5 py-2 rounded-md"/>
        </form>
    )
}