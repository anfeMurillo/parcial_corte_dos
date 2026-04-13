import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { updateProfileAction } from '@/actions/auth/updateProfile.action';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

  // Mock user data - in real app, get from context or API
  useEffect(() => {
    // Simulate loading user data
    setName('Usuario Ejemplo');
    setEmail('usuario@example.com');
  }, []);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 4000);
  };

  const onUpdateProfile = async () => {
    if (name.length === 0 || email.length === 0) {
      showMessage('Por favor complete nombre y email', 'error');
      return;
    }
    if (password && password !== confirmPassword) {
      showMessage('Las contraseñas no coinciden', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Mock userId and token - in real app, get from auth context
      const userId = 1;
      const token = 'mock-token';

      const updateData: any = { name, email };
      if (password) {
        updateData.password = password;
      }

      await updateProfileAction(userId, updateData, token);
      showMessage('Perfil actualizado exitosamente', 'success');
    } catch (error: any) {
      showMessage(typeof error === 'string' ? error : 'Error al actualizar perfil', 'error');
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
        <View className="flex-1 px-8 pt-12">

          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center shadow-lg">
              <Ionicons name="person-outline" size={45} color="white" />
            </View>
            <Text className="text-3xl font-bold mt-4 text-primary">Mi Perfil</Text>
            <Text className="text-gray-500 text-lg">Actualiza tu información</Text>
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
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Nombre Completo</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="person-outline" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

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

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Nueva Contraseña (opcional)</Text>
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

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Confirmar Nueva Contraseña</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="********"
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Pressable onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                  <Ionicons name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable
            className="bg-primary py-4 rounded-xl mt-8 shadow-lg"
            onPress={onUpdateProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Actualizar Perfil</Text>
            )}
          </Pressable>

          <Pressable
            className="mt-6"
            onPress={() => router.back()}
          >
            <Text className="text-primary text-center font-medium">Volver</Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;