import { apiFetch } from "@/shared/api/client";

interface FormInputInterface {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
}

export class AuthService {
  public static async login(
    dataForm: FormInputInterface
  ): Promise<LoginResponse> {
    return apiFetch<LoginResponse>(
      "auth/login",
      "POST",
      dataForm
    );
  }

  public static async logout(): Promise<void> {
    await apiFetch<{ message: string }>(
      "auth/logout",
      "POST"
    );
  }
}