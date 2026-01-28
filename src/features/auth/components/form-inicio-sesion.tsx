'use client'
//next
import { useRouter } from "next/navigation";
//react
import { useForm, SubmitHandler } from "react-hook-form" 
//features
import { AuthService } from '../services/auth.service';
import { FormValues } from '../types/auth.types';
//shared
import { Input } from '@/shared';
//toastify
import { toast } from 'react-toastify';
//global
import '@/app/globals.css'


export function InicioSesionForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try{
      const auth = await AuthService.login(data);
      if(auth){
        toast.success("Login exitos");
        router.push("/dashboard");
      }
    }catch(error: any){
      toast.error(error.message || 'usuario no encontrado' );
    }
  }

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
          <div>
            <Input  label="Email" name="email" type="email" register={register} rules={{ required: true }}/>
            {errors.email && <span className="text-sm text-red-400">Campo requerido</span>}
          </div>
          <div>
            <Input  label="Contraseña" name="password" type="password" register={register} rules={{ required: true }}/>
            {errors.password && <span className="text-sm text-red-400">Campo requerido</span>}
          </div>
          <div className='w-1/2 h-[40px] flex m-auto mt-10 mb-10'>
             <button disabled={isSubmitting} className='w-full h-full m-auto bg-black rounded-3xl' name="submit" type="submit">Entrar</button> 
          </div>
        </form>
  );
}
