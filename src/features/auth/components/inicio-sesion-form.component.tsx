'use client'
//NEXT
import { useRouter } from "next/navigation";
//REACT
import { useForm, SubmitHandler } from "react-hook-form" 
//FEATURES
import { AuthService } from '../services/auth.service';
import { FormValues } from '../types/auth.types';
//SHARED
import { Input } from '@/shared';
//TOASTIFY
import { toast } from 'react-toastify';
//GLOBAL
// import '@/app/globals.css'


interface InicioSesionFormProps {
  defaultValues?: Partial<FormValues>;
}

export function InicioSesionForm({ defaultValues }: InicioSesionFormProps = {}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ defaultValues });
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
          <div className='mt-8 mb-6'>
            <button
              disabled={isSubmitting}
              className="btn btn-primary btn-pill w-full h-11 text-white text-sm"
              name="submit"
              type="submit"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
  );
}
