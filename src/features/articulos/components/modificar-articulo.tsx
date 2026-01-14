'use client'
//react
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form" 
import {useState, useEffect} from 'react';
//Next
import {useRouter} from 'next/navigation';
import Image from "next/image";
//features
import {ArticulosService, ArticuloEntity, UpdateArticuloForm} from '@/features';
import { SecArticulo } from './sec-articulo';
//shared
import {InputArt, InputFile} from '@/shared';
//librerías
import {toast} from 'react-toastify'


export function ModificarArticulo(props: {id_articulo: string}){
    //definimos estados
    const [loading, setLoading] = useState<boolean>(true);
    const [addSec, setAddSec] = useState(true);
    //definimos variables
    const id_articulo = props.id_articulo;
    const router = useRouter();
    //destructuring de useForm 
    const {register, handleSubmit, control, formState: { errors }, reset } = 
    useForm<UpdateArticuloForm>({
        defaultValues: {
            titulo: '',
            subtitulo: '',
            image_file: undefined,
            image_alt: '',
            sec_articulo: []
        }
    })
    //traemos los datos del articulo al cargar el componente
    useEffect(() => {
        const fetchArticulo = async () => {
            try{
                const data = await ArticulosService.getArticuloById(id_articulo);
                reset({ //forma estandar para poblar un form con datos
                    titulo: data.titulo ?? '',
                    subtitulo: data.subtitulo ?? '',
                    image_alt: data.image_alt ?? '',
                    sec_articulo: data.sec_articulo?.map(sec => ({
                        id_sec: sec.id,
                        titulo_sec: sec.titulo_sec ?? '',
                        contenido_sec: sec.contenido_sec ?? '',
                        image_alt: sec.image_alt ?? '',
                        image_position: sec.image_position ?? 'left'
                    })) ?? []
                });
            }catch(error){
                console.log("error: " + error)
            } finally {
                setLoading(false);
            }  
        }
        fetchArticulo();
    }, [id_articulo, reset]);
    //destructuring de useFieldArray
    const { fields, append, remove } = useFieldArray({
        control,
        name: "sec_articulo"
    });

    //fn onSubmit
    const onSubmit: SubmitHandler<UpdateArticuloForm> = async (data) => {
        try{
            console.log("intentando actualizar articulo")
            await ArticulosService.updateArticulo(id_articulo, data);
            toast.success("Articulo actualizado");
            router.push('/articulos');
        }catch(error: any){
            toast.error(error.message || "Error al actualizar articulo");
        }
    }

    if (loading) return <div className="p-4">Cargando artículo...</div>;

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="w-full m-auto">
            {/* Cabecera articulo */}
            <div className="bg-white border border-gray-200 rounded-xl px-2 pt-1 pb-3">
            <InputArt label="Titulo" name="titulo" type="text" register={register} rules={{ required: true, minLength: {value: 1, message: 'Titulo demasiado corto'}, maxLength: {value: 50, message: 'Titulo demasiado largo'} }} textSize="lg"/>
            {errors.titulo && <span className="text-red-700 text-sm">{errors.titulo.message}</span>}
            <InputArt label="Subtitulo" name="subtitulo" type="text" register={register} rules={{ required: false, minLength: {value: 1, message: 'Subtitulo demasiado corto'}, maxLength: {value: 200, message: 'Subtitulo demasiado largo'} }} textSize="md"/>
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
                    <div className="relative">
                        <SecArticulo key={field.id} field={field} index={index} register={register} />
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
                <div className="h-20 flex border border-sky-600 rounded-xl">
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({id_sec: "", titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "none" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[80%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden me-1">
                            </div>
                        </button>
                    </div>
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({id_sec: "", titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "left" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden me-1">
                                <Image src='/image.png' width={100} height={100} alt="image" className="w-full h-full object-cover"></Image>
                            </div>
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden">
                            </div>
                        </button>
                    </div>
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({id_sec: "", titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "right" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden me-1">
                            </div>
                            <div className="w-[40%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden">
                                <Image src='/image.png' width={100} height={100} alt="image" className="w-full h-full object-cover"></Image>
                            </div>
                        </button>
                    </div>
                    <div className="w-1/4 h-full flex">
                        <button type="button" onClick={() => {setAddSec(!addSec); append({id_sec: "", titulo_sec: "", contenido_sec: "", image_file: undefined,  image_alt: "", image_position: "all" });}}
                            className="w-[60%] h-[80%] m-auto flex justify-center bg-white border border-gray-300 rounded-lg hover:bg-sky-100 transition-colors duration-300 cursor-pointer">
                            <div className="w-[80%] h-[80%] my-auto bg-gray-400 rounded-sm overflow-hidden">
                                <Image src='/image.png' width={100} height={100} alt="image" className="w-full h-full object-cover"></Image>
                            </div>
                        </button>
                    </div>
                </div>
                }
            </div>
            <input type='submit' value='Actualizar Articulo' 
            className="bg-sky-700 hover:bg-sky-600 transition-colores duration-300 cursor-pointer rounded-md px-5 py-2"/>
        </form>
    )
}