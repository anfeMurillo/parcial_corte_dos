import { ecommerceApi } from "@/api/ecommerceApi";
import { Product } from "@/interfaces/product.interface";

export const getProducts = async () => {
  try {
    const { data } = await ecommerceApi.get<{
      statusCode: number;
      message: string;
      data: Product[];
    }>("/api/products");
    return data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data.message || "Error al obtener productos";
    }
    console.log(error);
    throw "No se pudo conectar con el servidor";
  }
};
