import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getProducts } from '@/actions/products/getProducts.action';
import { Product } from '@/interfaces/product.interface';

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadProducts = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getProducts();
      setProducts(response.data || []);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(typeof error === 'string' ? error : 'Error al cargar los productos');
    } finally {
      if (isPullToRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text className="text-gray-600 mt-4">Cargando productos...</Text>
      </View>
    );
  }

  if (errorMessage.length > 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-red-600 text-center font-medium">{errorMessage}</Text>
        <Pressable
          className="mt-6 bg-primary px-5 py-3 rounded-xl"
          onPress={() => loadProducts()}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-3xl font-bold text-primary">Productos</Text>
          <Text className="text-gray-500 mt-1">Catálogo disponible</Text>
        </View>
        <Pressable
          className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center"
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#49129C" />
        </Pressable>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadProducts(true)}
            tintColor="#0EA5E9"
          />
        }
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-gray-500">No hay productos disponibles.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-3">
            <Text className="text-gray-900 text-base font-bold">{item.name}</Text>
            <Text className="text-gray-500 mt-1">{item.brand} {item.model}</Text>
            <Text className="text-primary text-lg font-semibold mt-2">
              ${Number(item.price).toLocaleString('es-CO')}
            </Text>
            <Text className="text-gray-600 mt-1">Stock: {item.stock}</Text>
          </View>
        )}
      />

      <Pressable className="mb-8 mt-2" onPress={() => router.back()}>
        <Text className="text-primary text-center font-medium">Volver</Text>
      </Pressable>
    </View>
  );
};

export default ProductsScreen;
