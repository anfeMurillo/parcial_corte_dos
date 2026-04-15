import React, { useEffect, useState } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { getProductById } from '@/actions/products/getProductById.action';
import { createProduct } from '@/actions/products/createProduct.action';
import { updateProduct } from '@/actions/products/updateProduct.action';
import { CreateProductDto } from '@/interfaces/product.interface';
import { getToken } from '@/utils/authStorage';

import CldImage from '@/components/CldImage';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '@/actions/products/uploadImage.action';

const ProductFormScreen = () => {
  const params = useLocalSearchParams<{
    id?: string;
    categoryId?: string;
    name?: string;
    price?: string;
    stock?: string;
    imageUrl?: string;
    description?: string;
    brand?: string;
    model?: string;
    weight?: string;
    color?: string;
  }>();

  const isEditing = !!params.id;

  const [categoryId, setCategoryId] = useState(params.categoryId ?? '');
  const [name, setName] = useState(params.name ?? '');
  const [price, setPrice] = useState(params.price ?? '');
  const [stock, setStock] = useState(params.stock ?? '');
  const [imageUrl, setImageUrl] = useState(params.imageUrl ?? '');
  const [description, setDescription] = useState(params.description ?? '');
  const [brand, setBrand] = useState(params.brand ?? '');
  const [model, setModel] = useState(params.model ?? '');
  const [weight, setWeight] = useState(params.weight ?? '');
  const [color, setColor] = useState(params.color ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null,
  });

  useEffect(() => {
    // Si estamos editando y faltan datos (o para asegurar datos frescos), 
    // consultamos el API por el ID.
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const resp = await getProductById(Number(params.id));
          const p = resp.data;
          setCategoryId(String(p.categoryId));
          setName(p.name);
          setPrice(String(p.price));
          setStock(String(p.stock));
          setImageUrl(p.imageUrl);
          setDescription(p.description);
          setBrand(p.brand);
          setModel(p.model);
          setWeight(String(p.weight));
          setColor(p.color);
        } catch (error) {
          console.log('Error pre-llenando formulario:', error);
        }
      };
      
      fetchProduct();
    }
  }, [params.id]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 4000);
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showMessage('Se requiere permiso para acceder a la galería', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsUploading(true);
      try {
        const publicId = await uploadImageToCloudinary(result.assets[0].uri);
        setImageUrl(publicId);
        showMessage('Imagen subida con éxito', 'success');
      } catch (error: any) {
        showMessage(error, 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async () => {
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
      const token = await getToken();
      if (!token) {
        showMessage('Debes iniciar sesión para continuar', 'error');
        setIsLoading(false);
        return;
      }

      if (isEditing) {
        await updateProduct(Number(params.id), payload, token);
        showMessage('Producto actualizado exitosamente', 'success');
      } else {
        await createProduct(payload, token);
        showMessage('Producto creado exitosamente', 'success');
      }
    } catch (error: any) {
      let errorMsg = 'Error al guardar producto';
      if (typeof error === 'string') {
        errorMsg = error;
      } else if (Array.isArray(error)) {
        errorMsg = error.join(', ');
      } else if (error && error.message) {
        errorMsg = error.message;
      }
      showMessage(errorMsg, 'error');
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
          <Text className="text-3xl font-bold text-primary">
            {isEditing ? 'Editar Producto' : 'Crear Producto'}
          </Text>
          <Text className="text-gray-500 mt-1 mb-6">
            {isEditing ? 'Modifica los datos del producto' : 'Publica un nuevo producto'}
          </Text>

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
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Categoría ID</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="number-pad"
                value={categoryId}
                onChangeText={setCategoryId}
                placeholder="Ej: 5"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Nombre</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={name}
                onChangeText={setName}
                placeholder="Nombre del producto"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Precio</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
                placeholder="Ej: 299999.99"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Stock</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="number-pad"
                value={stock}
                onChangeText={setStock}
                placeholder="Ej: 10"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">URL de Imagen (Public ID)</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                autoCapitalize="none"
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="Ej: sample_image"
              />
              
              {/* Image Preview / Upload Button */}
              <Pressable 
                onPress={pickImage}
                disabled={isUploading}
                className="mt-4 w-full h-48 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden"
              >
                {isUploading ? (
                  <View className="items-center">
                    <ActivityIndicator size="large" color="#49129C" />
                    <Text className="text-primary mt-2">Subiendo imagen...</Text>
                  </View>
                ) : imageUrl ? (
                  <View className="w-full h-full">
                    <CldImage 
                      publicId={imageUrl} 
                      width={800} 
                      height={500}
                      style={{ width: '100%', height: '100%' }}
                    />
                    <View className="absolute bottom-3 right-3 bg-primary/80 px-3 py-1.5 rounded-lg flex-row items-center">
                      <Ionicons name="camera-outline" size={16} color="white" />
                      <Text className="text-white text-xs font-bold ml-1.5">Cambiar</Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-2">
                      <Ionicons name="cloud-upload-outline" size={32} color="#49129C" />
                    </View>
                    <Text className="text-gray-600 font-bold">Toca para subir imagen</Text>
                    <Text className="text-gray-400 text-xs mt-1">Solo formato JPG, PNG</Text>
                  </View>
                )}
              </Pressable>
            </View>


            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Descripción</Text>
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
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Marca</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={brand}
                onChangeText={setBrand}
                placeholder="Marca"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Modelo</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={model}
                onChangeText={setModel}
                placeholder="Modelo"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Peso</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                placeholder="Ej: 0.192"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Color</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 text-gray-800"
                value={color}
                onChangeText={setColor}
                placeholder="Color"
              />
            </View>
          </View>

          <Pressable
            onPress={onSubmit}
            disabled={isLoading}
            className={`mt-8 py-4 rounded-xl items-center justify-center ${
              isLoading ? 'bg-primary/70' : 'bg-primary shadow-md'
            }`}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
              </Text>
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

export default ProductFormScreen;
