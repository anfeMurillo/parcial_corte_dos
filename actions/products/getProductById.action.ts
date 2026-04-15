import { ecommerceApi } from "@/api/ecommerceApi";
import { Product } from "@/interfaces/product.interface";

export const getProductById = async (id: number) => {
  try {
    const { data } = await ecommerceApi.get<{
      statusCode: number;
      message: string;
      data: Product;
    }>(`/api/products/${id}`);
    
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || "Error al obtener el producto";
    }
    console.log(error);
    throw "No se pudo conectar con el servidor";
  }
};
