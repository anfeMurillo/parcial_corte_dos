import { ecommerceApi } from "@/api/ecommerceApi";
import { CreateProductDto, Product } from "@/interfaces/product.interface";

export const createProduct = async (payload: CreateProductDto, token: string) => {
  try {
    const { data } = await ecommerceApi.post<{
      statusCode: number;
      message: string;
      data: Product;
    }>(
      "/api/products",
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
      throw error.response.data.message || "Error al crear el producto";
    }
    console.log(error);
    throw "No se pudo conectar con el servidor";
  }
};
