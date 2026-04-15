import { ecommerceApi } from "@/api/ecommerceApi";
import { AuthResponse, RegisterRequest } from "@/interfaces/auth.interface";
import { encryptPassword } from "@/utils/crypto";

export const registerAction = async (userData: RegisterRequest) => {
  try {
    const { data } = await ecommerceApi.post<AuthResponse>("/api/auth/register", {
      ...userData,
      role: userData.role.toUpperCase(),
      encryptedPassword: encryptPassword(userData.password),
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || 'Error en el registro';
    }
    console.log(error);
    throw 'No se pudo conectar con el servidor';
  }
};