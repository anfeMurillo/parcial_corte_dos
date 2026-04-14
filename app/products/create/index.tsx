import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { createProduct } from '@/actions/products/createProduct.action';
import { CreateProductDto } from '@/interfaces/product.interface';

const CreateProductScreen = () => {
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [weight, setWeight] = useState('');
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null,
  });

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 4000);
  };

  const onCreateProduct = async () => {
    if (
      categoryId.length === 0 ||
      name.length === 0 ||
      price.length === 0 ||
      stock.length === 0 ||
      imageUrl.length === 0 ||
      description.length === 0 ||
      brand.length === 0 ||
      model.length === 0 ||
      weight.length === 0 ||
      color.length === 0
    ) {
      showMessage('Por favor complete todos los campos', 'error');
      return;
    }

    const payload: CreateProductDto = {
      categoryId: Number(categoryId),
      name,
      price: Number(price),
      stock: Number(stock),
      imageUrl,
      description,
      brand,
      model,
      weight: Number(weight),
      color,
    };

    if (
      Number.isNaN(payload.categoryId) ||
      Number.isNaN(payload.price) ||
      Number.isNaN(payload.stock) ||
      Number.isNaN(payload.weight)
    ) {
      showMessage('Los campos numéricos deben ser válidos', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const token = 'mock-token';
      await createProduct(payload, token);
      showMessage('Producto creado exitosamente', 'success');
    } catch (error: any) {
      showMessage(typeof error === 'string' ? error : 'Error al crear producto', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-12 pb-10">
          <Text className="text-3xl font-bold text-primary">Crear Producto</Text>
          <Text className="text-gray-500 mt-1 mb-6">Publica un nuevo producto</Text>

          {message.type && (
            <View
              className={`mb-6 p-4 rounded-xl ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <Text
                className={`font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {message.text}
              </Text>
            </View>
          )}

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">categoryId</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="number-pad"
                value={categoryId}
                onChangeText={setCategoryId}
                placeholder="Ej: 5"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">name</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={name}
                onChangeText={setName}
                placeholder="Nombre del producto"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">price</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
                placeholder="Ej: 299999.99"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">stock</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="number-pad"
                value={stock}
                onChangeText={setStock}
                placeholder="Ej: 10"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">imageUrl</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                autoCapitalize="none"
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://..."
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">description</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                placeholder="Descripción del producto"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">brand</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={brand}
                onChangeText={setBrand}
                placeholder="Marca"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">model</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={model}
                onChangeText={setModel}
                placeholder="Modelo"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">weight</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                placeholder="Ej: 0.192"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">color</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={color}
                onChangeText={setColor}
                placeholder="Color"
              />
            </View>
          </View>

          <Pressable
            onPress={onCreateProduct}
            disabled={isLoading}
            className={`mt-8 py-4 rounded-xl items-center justify-center ${
              isLoading ? 'bg-primary/70' : 'bg-primary shadow-md'
            }`}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Crear Producto</Text>
            )}
          </Pressable>

          <Pressable className="mt-6" onPress={() => router.back()}>
            <Text className="text-primary text-center font-medium">Volver</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateProductScreen;
