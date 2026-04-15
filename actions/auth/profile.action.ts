import { ecommerceApi } from "@/api/ecommerceApi";
import { getToken } from "@/utils/authStorage";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export const getMyProfileAction = async () => {
  const token = await getToken();
  if (!token) throw 'No hay sesión activa';

  try {
    const { data } = await ecommerceApi.get("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || 'Error al obtener perfil';
    }
    throw 'No se pudo conectar con el servidor';
  }
};

export const getPersonalInfoAction = async () => {
  const token = await getToken();
  if (!token) throw 'No hay sesión activa';

  try {
    const { data } = await ecommerceApi.get("/api/users/me/personal-info", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || 'Error al obtener información personal';
    }
    throw 'No se pudo conectar con el servidor';
  }
};

export const updatePersonalInfoAction = async (info: Partial<PersonalInfo>) => {
  const token = await getToken();
  if (!token) throw 'No hay sesión activa';

  try {
    const { data } = await ecommerceApi.put("/api/users/me/personal-info", info, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || 'Error al actualizar perfil';
    }
    throw 'No se pudo conectar con el servidor';
  }
};
