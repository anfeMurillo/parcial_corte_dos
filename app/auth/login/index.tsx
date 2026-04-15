import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { loginAction } from '@/actions/auth/login.action';
import { saveAuthData } from '@/utils/authStorage';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 4000);
  };

  const onLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      showMessage('Por favor ingrese todos los campos', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Nota: La API requiere contraseña cifrada AES-256-CBC.
      const resp = await loginAction(email, password);
      
      // Save auth token and user data
      await saveAuthData({
        token: resp.data.token,
        userId: resp.data.userId,
        email: resp.data.email,
        role: resp.data.role,
      });

      showMessage(`¡Bienvenido! ${resp.data.email}`, 'success');
      const role = resp.data.role.toLowerCase();
      if (role === 'buyer' || role === 'admin') {
        router.replace('/products');
      } else if (role === 'seller') {
        router.replace('/products'); // Seller also goes to products (home)
      } else {
        showMessage('Rol no soportado para navegación', 'error');
      }
    } catch (error: any) {
      showMessage(typeof error === 'string' ? error : 'Error de autenticación', 'error');
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
        <View className="flex-1 px-8 justify-center">
          
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center shadow-lg">
              <Ionicons name="cart-outline" size={45} color="white" />
            </View>
            <Text className="text-3xl font-bold mt-4 text-primary">E-Commerce</Text>
            <Text className="text-gray-500 text-lg">Inicia sesión para continuar</Text>
          </View>

          {message.type && (
            <View className={`mb-6 p-4 rounded-xl flex-row items-center ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <Ionicons 
                name={message.type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'} 
                size={24} 
                color={message.type === 'success' ? '#16a34a' : '#dc2626'} 
              />
              <Text className={`ml-3 flex-1 font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message.text}
              </Text>
            </View>
          )}

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Correo Electrónico</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="ejemplo@correo.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Contraseña</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="********"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                </Pressable>
              </View>
            </View>

            <Pressable className="items-end mt-2">
              <Text className="text-primary font-medium">¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Pressable 
              onPress={onLogin}
              disabled={isLoading}
              className={`mt-8 py-4 rounded-xl items-center justify-center ${isLoading ? 'bg-primary/70' : 'bg-primary shadow-md'}`}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">Iniciar Sesión</Text>
              )}
            </Pressable>

            <View className="flex-row justify-center mt-10">
              <Text className="text-gray-600">¿No tienes una cuenta? </Text>
              <Pressable onPress={() => router.replace('/auth/register')}>
                <Text className="text-primary font-bold">Regístrate</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
