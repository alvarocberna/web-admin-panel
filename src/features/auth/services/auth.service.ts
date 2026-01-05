
import {apiFetch} from "@/shared/api/client"

interface FormInputInterface {
  email: string
  password: string
}

export class AuthService{

    public static async login(dataForm: FormInputInterface): Promise<any>{
        const data = {
            email: dataForm.email,
            password: dataForm.password
        }
        console.log('AuthService login data:', data);
        const response = await apiFetch<{ message: string }>('auth/login', 'POST', data)
        return response;
    }

    public static async logout(): Promise<void>{
        await apiFetch<{ message: string }>('auth/logout', 'POST')
        return Promise.resolve();
    }

}