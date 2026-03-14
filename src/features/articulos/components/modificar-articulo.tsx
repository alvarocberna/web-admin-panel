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
            {/* Cabecera artículo */}
            <div className="card px-4 pt-2 pb-4">
                <InputArt label="Título" name="titulo" type="text" register={register} rules={{ required: true, minLength: {value: 1, message: 'Título demasiado corto'}, maxLength: {value: 200, message: 'Título demasiado largo'} }} textSize="lg"/>
                {errors.titulo && <span className="text-red-600 text-xs mt-1 block">{errors.titulo.message}</span>}
                <InputArt label="Subtítulo" name="subtitulo" type="text" register={register} rules={{ required: false, minLength: {value: 1, message: 'Subtítulo demasiado corto'}, maxLength: {value: 200, message: 'Subtítulo demasiado largo'} }} textSize="md"/>
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
                    rules={{ required: false }}
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
                                    append({ id_sec: "", titulo_sec: "", contenido_sec: "", image_file: undefined, image_alt: "", image_position: position });
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
                Actualizar artículo
            </button>
        </form>
    )
}