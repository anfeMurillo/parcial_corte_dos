import { ecommerceApi } from "@/api/ecommerceApi";
import { AuthResponse } from "@/interfaces/auth.interface";
import { encryptPassword } from "@/utils/crypto";

export const loginAction = async (email: string, password: string) => {
  try {
    const encryptedPassword = encryptPassword(password);
    const { data } = await ecommerceApi.post<AuthResponse>("/api/auth/login", {
      email,
      encryptedPassword,
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || 'Error en el inicio de sesión';
    }
    console.log(error);
    throw 'No se pudo conectar con el servidor';
  }
};
