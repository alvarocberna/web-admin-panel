'use client'
//react
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form" 
import {useState, useEffect} from 'react';
//Next
import {useRouter} from 'next/navigation';
import Image from "next/image";
//features
import {ArticulosService, ArticuloEntity, UpdateArticuloForm} from '@/features';
import { SecArticulo } from './sec-articulo.component';
//shared
import {InputArt, InputFile} from '@/shared';
//librerías
import {toast} from 'react-toastify'


export function ArticuloFormUpdate(props: {id_articulo: string}){
    //definimos estados
    const [loading, setLoading] = useState<boolean>(true);
    const [addSec, setAddSec] = useState(true);
    const [articuloData, setArticuloData] = useState<ArticuloEntity | null>(null);
    const [activo, setActivo] = useState<boolean>(true);
    //definimos variables
    const id_articulo = props.id_articulo;
    const router = useRouter();

    //destructuring de useForm 
    const {
        register, 
        handleSubmit, 
        control, 
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UpdateArticuloForm>({
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
                setArticuloData(data);
                setActivo(data.activo ?? true);
                reset({ //forma estandar para poblar un form con datos
                    titulo: data.titulo ?? '',
                    subtitulo: data.subtitulo ?? '',
                    image_url: data.image_url ?? null,
                    image_alt: data.image_alt ?? '',
                    sec_articulo: data.sec_articulo?.map(sec => ({
                        id_sec: sec.id,
                        titulo_sec: sec.titulo_sec ?? '',
                        contenido_sec: sec.contenido_sec ?? '',
                        image_url: sec.image_url ?? null,
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
            await ArticulosService.updateArticulo(id_articulo, { ...data, activo });
            toast.success("Articulo actualizado");
            router.push('/articulos');
        }catch(error: any){
            toast.error(error.message || "Error al actualizar articulo");
        }
    }

    if (loading) return <div className="p-4">Cargando artículo...</div>;

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="w-full m-auto">
            {/* Estado del artículo */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-medium text-zinc-600">Estado del artículo</span>
                <button
                    type="button"
                    onClick={() => setActivo(prev => !prev)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${activo ? 'bg-green-500' : 'bg-zinc-300'}`}
                    aria-pressed={activo}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${activo ? 'translate-x-6' : 'translate-x-1'}`} />
                    <span className="sr-only">{activo ? 'Activo' : 'Inactivo'}</span>
                </button>
                <span className={`text-xs font-semibold ml-2 ${activo ? 'text-green-600' : 'text-zinc-400'}`}>
                    {activo ? 'Activo' : 'Inactivo'}
                </span>
            </div>

            {/* Cabecera artículo */}
            <div className="card px-4 pt-2 pb-4">
                <InputArt
                    label="Título" 
                    name="titulo" 
                    type="text" 
                    register={register} 
                    rules={{ 
                        required: true, 
                        minLength: {value: 1, message: 'Mínimo 1 caracter'}, 
                        maxLength: {value: 200, message: 'Máximo 200 caracteres'} }} 
                    textSize="lg"/>
                {errors.titulo && <span className="text-red-600 text-xs mt-1 block">{errors.titulo.message}</span>}
                <InputArt 
                    label="Subtítulo" 
                    name="subtitulo" 
                    type="text" 
                    register={register} 
                    rules={{ 
                        required: false, 
                        maxLength: {value: 500, message: 'Subtítulo demasiado largo'} }} 
                    textSize="md"/>
                {errors.subtitulo && <span className="text-red-600 text-xs mt-1 block">{errors.subtitulo.message}</span>}
                <InputFile
                    label="Imagen de portada"
                    name={"image_file" as any}
                    register={register}
                    rules={{ required: false }}
                    accept="image/*"
                    currentImageUrl={articuloData?.image_url}
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
                        <SecArticulo field={field} index={index} register={register} currentImageUrl={field.image_url} />
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

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
        </form>
    )
}