import { ecommerceApi } from "@/api/ecommerceApi";

export const deleteProduct = async (id: number, token: string) => {
  try {
    const { data } = await ecommerceApi.delete<{
      statusCode: number;
      message: string;
      data: any;
    }>(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || "Error al eliminar el producto";
    }
    console.log(error);
    throw "No se pudo conectar con el servidor";
  }
};
