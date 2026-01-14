'use client'
//react
import { UseFormRegister, FieldValues } from "react-hook-form"
//shared
import { InputArt, TextAreaArt, InputFile } from "@/shared"

interface SecArticuloProps<T extends FieldValues = FieldValues> {
  field: any
  index: number
  register: UseFormRegister<T>
}

export function SecArticulo<T extends FieldValues = FieldValues>({ field, index, register }: SecArticuloProps<T>) {
  //definimos los estilos de la Sec en base a la posición de la imagen
  const imagePosition = field.image_position || 'left';
  const flex = imagePosition === 'left' ? 'flex flex-row-reverse' : 'flex';
  const textW = (imagePosition === 'left' || imagePosition === 'right') ? '[60%]' : 'full';
  const imgW = (imagePosition === 'left' || imagePosition === 'right') ? '[40%]' : 'full';
  const textHidden = imagePosition === 'all' ? 'hidden' : '';
  const imgHidden = imagePosition === 'none' ? 'hidden' : '';
  
  return (
    <div key={field.id} className={`${flex} justify-between my-5 bg-white border border-gray-200 rounded-xl pt-1 pb-3`}>
            <div className={`w-${textW} ${textHidden} px-2`} >
                <InputArt
                    label={`Título Sub Sección ${index + 1}`}
                    name={`sec_articulo.${index}.titulo_sec` as any}
                    type="text"
                    register={register}
                    rules={{ required: false }}
                />
                <TextAreaArt
                    label={`Contenido Sub Sección ${index + 1}`}
                    name={`sec_articulo.${index}.contenido_sec` as any}
                    register={register}
                    rules={{ required: false }}
                />
            </div>
            <div className={`w-${imgW} ${imgHidden} px-2`}>
                <InputFile
                    label={``}
                    name={`sec_articulo.${index}.image_file` as any}
                    register={register}
                    rules={{ required: false }}
                    accept="image/*"
                />

                <InputArt
                    label={`Texto alternativo de la imagen (Alt)`}
                    name={`sec_articulo.${index}.image_alt` as any}
                    type="text"
                    register={register}
                    rules={{ required: false }}
                />
            </div>
            <input type="hidden"
                {...register(`sec_articulo.${index}.image_position` as any)}
                value={imagePosition}
            />
            <input type="hidden"
                {...register(`sec_articulo.${index}.id_sec` as any)}
                value={field.id_sec}
            />
    </div>
  )
}
