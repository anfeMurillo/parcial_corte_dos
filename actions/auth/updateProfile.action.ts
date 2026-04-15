import { ecommerceApi } from "@/api/ecommerceApi";
import { AuthResponse, UpdateProfileRequest, UserProfile } from "@/interfaces/auth.interface";
import { encryptPassword } from "@/utils/crypto";

export const updateProfileAction = async (userId: number, updateData: UpdateProfileRequest, token: string) => {
  try {
    const { data } = await ecommerceApi.put<UserProfile>(`/api/auth/profile/${userId}`, {
      ...updateData,
      encryptedPassword: updateData.password ? encryptPassword(updateData.password) : undefined,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || 'Error al actualizar perfil';
    }
    console.log(error);
    throw 'No se pudo conectar con el servidor';
  }
};