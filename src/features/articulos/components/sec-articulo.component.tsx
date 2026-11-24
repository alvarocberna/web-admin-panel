'use client'
//react
import { UseFormRegister, FieldValues } from "react-hook-form"
//shared
import { InputArt, TextAreaArt, InputFile } from "@/shared"

interface SecArticuloProps<T extends FieldValues = FieldValues> {
  field: any
  index: number
  register: UseFormRegister<T>
  currentImageUrl?: string | null
}

export function SecArticulo<T extends FieldValues = FieldValues>({ field, index, register, currentImageUrl }: SecArticuloProps<T>) {
  //definimos los estilos de la Sec en base a la posición de la imagen
  const imagePosition = field.imagePosition || 'left';
  const flex = imagePosition === 'left' ? 'flex flex-row-reverse' : 'flex';
  const textW = (imagePosition === 'left' || imagePosition === 'right') ? '[60%]' : 'full';
  const imgW = (imagePosition === 'left' || imagePosition === 'right') ? '[40%]' : 'full';
  const textHidden = imagePosition === 'all' ? 'hidden' : '';
  const imgHidden = imagePosition === 'none' ? 'hidden' : '';
  
  return (
    <div key={field.id} className={`${flex} justify-between card pt-2 pb-4`}>
            <div className={`w-${textW} ${textHidden} px-2`} >
                <InputArt
                    label={`Título Sub Sección ${index + 1}`}
                    name={`secArticulo.${index}.tituloSec` as any}
                    type="text"
                    register={register}
                    rules={{ required: false, minLength: {value: 1, message: 'Mínomo 1 caracter'}, maxLength: {value: 200, message: 'Máximo 200 caracteres'} }}
                />
                <TextAreaArt
                    label={`Contenido Sub Sección ${index + 1}`}
                    name={`secArticulo.${index}.contenidoSec` as any}
                    register={register}
                    rules={{ required: false, minLength: {value: 1, message: 'Mínimo 1 caracter'}, maxLength: {value: 5000, message: 'Máximo 5000 caracteres'} }}
                />
            </div>
            <div className={`w-${imgW} ${imgHidden} px-2`}>
                <InputFile
                    label={``}
                    name={`secArticulo.${index}.imageFile` as any}
                    register={register}
                    rules={{ required: false }}
                    accept="image/*"
                    currentImageUrl={currentImageUrl}
                />

                <InputArt
                    label={`Texto alternativo de la imagen (Alt)`}
                    name={`secArticulo.${index}.imageAlt` as any}
                    type="text"
                    register={register}
                    rules={{ required: false,  maxLength: {value: 100, message: 'Máximo 100 caracteres'} }}
                />
            </div>
            <input type="hidden"
                {...register(`secArticulo.${index}.imagePosition` as any)}
                value={imagePosition}
            />
            <input type="hidden"
                {...register(`secArticulo.${index}.idSec` as any)}
                value={field.idSec}
            />
    </div>
  )
}
