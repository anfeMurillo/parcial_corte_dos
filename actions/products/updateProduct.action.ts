import { ecommerceApi } from "@/api/ecommerceApi";
import { CreateProductDto, Product } from "@/interfaces/product.interface";

export const updateProduct = async (
  id: number,
  payload: Partial<CreateProductDto>,
  token: string
) => {
  try {
    const { data } = await ecommerceApi.put<{
      statusCode: number;
      message: string;
      data: Product;
    }>(
      `/api/products/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || "Error al actualizar el producto";
    }
    console.log(error);
    throw "No se pudo conectar con el servidor";
  }
};
