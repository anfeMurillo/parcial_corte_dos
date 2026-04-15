import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getProductById } from '@/actions/products/getProductById.action';
import { deleteProduct } from '@/actions/products/deleteProduct.action';
import { Product } from '@/interfaces/product.interface';
import { getUser, StoredUser } from '@/utils/authStorage';
import CldImage from '@/components/CldImage';

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [prodRes, userData] = await Promise.all([
          getProductById(Number(id)),
          getUser(),
        ]);
        setProduct(prodRes.data);
        setUser(userData);
      } catch (error: any) {
        setErrorMessage(typeof error === 'string' ? error : 'Error al cargar el detalle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const navigateToEdit = () => {
    if (!product) return;
    router.push({
      pathname: '/products/create',
      params: {
        id: String(product.id),
        categoryId: String(product.categoryId),
        name: product.name,
        price: String(product.price),
        stock: String(product.stock),
        imageUrl: product.imageUrl,
        description: product.description,
        brand: product.brand,
        model: product.model,
        weight: String(product.weight),
        color: product.color,
      },
    });
  };

  const handleDelete = async () => {
    if (!product || !user?.token) return;

    Alert.alert(
      '¿Eliminar producto?',
      '¿Estás seguro de que deseas eliminar este producto? Esta acción lo desactivará en la tienda.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await deleteProduct(product.id, user.token);
              router.replace('/products');
            } catch (error: any) {
              Alert.alert('Error', typeof error === 'string' ? error : 'No se pudo eliminar el producto');
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#49129C" />
      </View>
    );
  }

  if (errorMessage || !product) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-red-500 text-center font-medium">{errorMessage || 'Producto no encontrado'}</Text>
        <Pressable className="mt-4 bg-primary px-6 py-2 rounded-xl" onPress={() => router.back()}>
          <Text className="text-white font-bold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  const isEditable = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'seller';

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Image Section */}
        <View className="relative w-full h-[400px] bg-gray-100">
          <CldImage 
            publicId={product.imageUrl} 
            width={1200} 
            height={1200}
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Top Overlays */}
          <SafeAreaView className="absolute top-4 left-4 right-4 flex-row justify-between items-center">
            <Pressable 
              onPress={() => router.back()}
              className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md focus:bg-gray-100"
            >
              <Ionicons name="chevron-back" size={24} color="#1F2937" />
            </Pressable>
            
            {isEditable && (
              <View className="flex-row items-center gap-3">
                <Pressable 
                  onPress={handleDelete}
                  className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md active:bg-red-50"
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </Pressable>

                <Pressable 
                  onPress={navigateToEdit}
                  className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-md"
                >
                  <Ionicons name="pencil-outline" size={20} color="#49129C" />
                </Pressable>
              </View>
            )}
          </SafeAreaView>
        </View>

        {/* Product Details Content */}
        <View className="px-6 -mt-8 bg-white rounded-t-[32px] pt-8 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest">
              {product.brand} • {product.model}
            </Text>
            {product.stock > 0 ? (
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-[10px] font-bold">EN STOCK</Text>
              </View>
            ) : (
              <View className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-red-700 text-[10px] font-bold">AGOTADO</Text>
              </View>
            )}
          </View>

          <Text className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
            {product.name}
          </Text>

          <View className="flex-row items-baseline mb-6">
            <Text className="text-3xl font-black text-primary">
              ${Number(product.price).toLocaleString('es-CO')}
            </Text>
            <Text className="text-gray-400 ml-2 text-sm font-medium">COP</Text>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-800 mb-2">Descripción</Text>
            <Text className="text-gray-500 leading-6 text-sm">
              {product.description}
            </Text>
          </View>

          {/* Specifications Grid */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-800 mb-4">Especificaciones</Text>
            <View className="flex-row flex-wrap">
              {[
                { label: 'Color', value: product.color, icon: 'color-palette-outline' },
                { label: 'Peso', value: `${product.weight} kg`, icon: 'scale-outline' },
                { label: 'Stock', value: `${product.stock} unidades`, icon: 'cube-outline' },
                { label: 'Categoría', value: String(product.categoryId), icon: 'pricetag-outline' },
              ].map((item, idx) => (
                <View key={idx} className="w-1/2 p-2">
                  <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <Ionicons name={item.icon as any} size={20} color="#49129C" />
                    <Text className="text-gray-400 text-xs mt-2 font-medium">{item.label}</Text>
                    <Text className="text-gray-800 text-sm font-bold mt-0.5">{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Action Button */}
          <Pressable 
            className="w-full bg-primary py-5 rounded-2xl items-center justify-center shadow-lg active:scale-[0.98]"
            style={{ shadowColor: '#49129C', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10 }}
          >
            <Text className="text-white text-lg font-black tracking-wide">
              {product.stock > 0 ? 'Añadir al Carrito' : 'Notificar Disponibilidad'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;
