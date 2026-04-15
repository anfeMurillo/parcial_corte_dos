import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getProducts } from '@/actions/products/getProducts.action';
import { Product } from '@/interfaces/product.interface';
import { getUser, StoredUser } from '@/utils/authStorage';
import CldImage from '@/components/CldImage';

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);
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
      const [response, userData] = await Promise.all([
        getProducts(),
        getUser()
      ]);
      setProducts(response.data || []);
      setUser(userData);
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

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const navigateToEdit = (product: Product) => {
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
        contentContainerStyle={{ paddingBottom: 100 }}
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
          <Pressable 
            onPress={() => router.push(`/products/${item.id}`)}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-3 active:bg-gray-100"
          >
            <View className="flex-row items-center">
              {/* Product Image */}
              <View className="w-20 h-20 bg-gray-200 rounded-xl mr-4 overflow-hidden">
                {item.imageUrl ? (
                  <CldImage 
                    publicId={item.imageUrl} 
                    width={200} 
                    height={200}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="image-outline" size={30} color="#9CA3AF" />
                  </View>
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-2">
                    <Text className="text-gray-900 text-base font-bold" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-gray-500 text-xs mt-0.5">{item.brand} {item.model}</Text>
                    <Text className="text-primary text-base font-bold mt-1">
                      ${Number(item.price).toLocaleString('es-CO')}
                    </Text>
                    <Text className="text-gray-600 text-xs">Stock: {item.stock}</Text>
                  </View>
                  {(user?.role?.toLowerCase() === 'seller' || user?.role?.toLowerCase() === 'admin') && (
                    <Pressable
                      className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center z-10"
                      onPress={(e) => {
                        e.stopPropagation();
                        navigateToEdit(item);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#49129C" />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />


      {/* Floating Action Button – Crear Producto (Solo Seller/Admin) */}
      {(user?.role?.toLowerCase() === 'seller' || user?.role?.toLowerCase() === 'admin') && (
        <Pressable
          className="absolute bottom-8 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
          style={{ elevation: 6 }}
          onPress={() => router.push('/products/create')}
        >
          <Ionicons name="add" size={30} color="white" />
        </Pressable>
      )}

      <Pressable className="mb-8 mt-2" onPress={() => router.back()}>
        <Text className="text-primary text-center font-medium">Volver</Text>
      </Pressable>
    </View>
  );
};

export default ProductsScreen;
