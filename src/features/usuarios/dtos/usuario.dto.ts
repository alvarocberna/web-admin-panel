
export abstract class UpdateUsuarioInfoDto {
    abstract nombre: string;
    abstract apellido: string;
    abstract email: string;
}

export abstract class UpdateUsuarioPasswordDto {
    abstract currentPassword: string;
    abstract newPassword: string;
}
