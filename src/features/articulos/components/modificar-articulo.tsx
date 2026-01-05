'use client'
//react
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form" 
import {useState, useEffect} from 'react';
//Next
import {useRouter} from 'next/navigation';
//features
import {ArticulosService, ArticuloEntity, UpdateArticuloForm} from '@/features';
//shared
import {InputArt, TextAreaArt} from '@/shared';
//librerías
import {toast} from 'react-toastify'


export function ModificarArticulo(props: {id_articulo: string}){
    //definimos estados
    const [articulo, setArticulo] = useState<ArticuloEntity>();
    const [loading, setLoading] = useState<boolean>(true);
    //definimos variables
    const id_articulo = props.id_articulo;
    const router = useRouter();

    const {register, handleSubmit, control, formState: { errors }, reset } = 
    useForm<UpdateArticuloForm>({
        defaultValues: {
            titulo: '',
            subtitulo: '',
            sec_articulo: []
        }
    })

    //traemos los datos del articulo al cargar el componente
    useEffect(() => {
        const fetchArticulo = async () => {
            try{
                const data = await ArticulosService.getArticuloById(id_articulo);
                setArticulo(data);
                reset({
                    titulo: data.titulo ?? '',
                    subtitulo: data.subtitulo ?? '',
                    sec_articulo: data.sec_articulo?.map(sec => ({
                        titulo_sec: sec.titulo_sec ?? '',
                        contenido_sec: sec.contenido_sec ?? ''
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
    const { fields, append } = useFieldArray({
        control,
        name: "sec_articulo"
    });

    //definimos funciones
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
            {/* Titulo */}
            <div className="bg-white px-2 pt-1 pb-3">
            <InputArt label="Titulo" name="titulo" type="text" register={register} rules={{ required: true, minLength: {value: 1, message: 'Titulo demasiado corto'}, maxLength: {value: 50, message: 'Titulo demasiado largo'} }} textSize="lg"/>
            {errors.titulo && <span className="text-red-700 text-sm">{errors.titulo.message}</span>}
            <InputArt label="Subtitulo" name="subtitulo" type="text" register={register} rules={{ required: false, minLength: {value: 1, message: 'Subtitulo demasiado corto'}, maxLength: {value: 200, message: 'Subtitulo demasiado largo'} }} textSize="md"/>
            {errors.subtitulo && <span className="text-red-700 text-sm">{errors.subtitulo.message}</span>}
            </div>
            {/* Contenido */}
            <div>
                {fields.map((field, index) => (
                    <div key={field.id} className="my-5 bg-white px-2 pt-1 pb-3">
                        <InputArt
                        label={`Título Sub Sección ${index + 1}`}
                        name={`sec_articulo.${index}.titulo_sec`}
                        type="text"
                        register={register}
                        rules={{ required: true }}
                        />

                        <TextAreaArt
                        label={`Contenido Sub Sección ${index + 1}`}
                        name={`sec_articulo.${index}.contenido_sec`}
                        register={register}
                        rules={{ required: true }}
                        />
                    </div>
                ))}
            </div>
            <button
            type="button"
            onClick={() => append({ titulo_sec: "", contenido_sec: "" })}
            className="w-full h-10 bg-transparent border border-cyan-600 text-cyan-600 hover:bg-indigo-100 rounded mt-1 mb-10 transition-colors duration-300 cursor-pointer">
                Agregar Sub Sección
            </button>
            <input type='submit' value='Actualizar Articulo' className="bg-cyan-700 px-5 py-2"/>
        </form>
    )
}