'use client'
//react
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form" 
//Next
import {useRouter} from 'next/navigation';
//features
import {NuevoArticuloInterface, ArticulosService, CreateArticuloForm} from '@/features';
//shared
import {InputArt, TextAreaArt} from '@/shared';
//librerías
import {toast} from 'react-toastify'

export function NuevoArticulo(){
    //definimos variables
    const router = useRouter();
    const {register, handleSubmit, control, formState: { errors } } = 
    useForm<CreateArticuloForm>({
        defaultValues: {
            sec_articulo: []
        }
    })
    const { fields, append } = useFieldArray({
        control,
        name: "sec_articulo"
    });
    //definimos funciones
    const onSubmit: SubmitHandler<CreateArticuloForm> = (data) => {
        try{
            console.log("intentando crear articulo")
            ArticulosService.createArticulo(data);
            toast.success("Articulo creado");
            router.push('/articulos');
        }catch(error: any){
            toast.error(error.message || "Error al crear articulo");
        }
    }

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
            <input type='submit' value='Crear Articulo' className="bg-cyan-700 px-5 py-2"/>
        </form>
    )
}