import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getPersonalInfoAction, updatePersonalInfoAction } from '@/actions/auth/profile.action';
import { getUser, clearAuthData } from '@/utils/authStorage';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 4000);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsFetching(true);
    try {
      const user = await getUser();
      if (user) {
        setEmail(user.email);
        setRole(user.role);
      }

      const resp = await getPersonalInfoAction();
      if (resp.data) {
        setFirstName(resp.data.firstName || '');
        setLastName(resp.data.lastName || '');
        setPhoneNumber(resp.data.phoneNumber || '');
        setDateOfBirth(resp.data.dateOfBirth || '');
      }
    } catch (error: any) {
      showMessage(typeof error === 'string' ? error : 'Error al cargar perfil', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  const onUpdateProfile = async () => {
    if (firstName.length === 0 || lastName.length === 0) {
      showMessage('Nombre y apellido son requeridos', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await updatePersonalInfoAction({
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth,
      });
      showMessage('Perfil actualizado exitosamente', 'success');
    } catch (error: any) {
      showMessage(typeof error === 'string' ? error : 'Error al actualizar perfil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onLogout = async () => {
    await clearAuthData();
    router.replace('/auth/login');
  };

  if (isFetching) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#49129C" />
        <Text className="text-gray-500 mt-4">Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 pt-12">

          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center">
              <Ionicons name="person-outline" size={45} color="white" />
            </View>
            <Text className="text-3xl font-bold mt-4 text-primary">Mi Perfil</Text>
            <Text className="text-gray-500 text-lg">{email}</Text>
            <View className="bg-primary/10 rounded-full px-4 py-1 mt-2">
              <Text className="text-primary font-medium text-sm">{role}</Text>
            </View>
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

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 ml-1 font-medium">Nombre</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="Tu nombre"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 ml-1 font-medium">Apellido</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="Tu apellido"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 ml-1 font-medium">Teléfono</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
              <Ionicons name="call-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="+57 300 123 4567"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 ml-1 font-medium">Fecha de Nacimiento</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="1990-05-15"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>
          </View>

          <Pressable
            className="bg-primary py-4 rounded-xl mt-4"
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
            className="mt-4 py-4 rounded-xl border border-red-300 bg-red-50"
            onPress={onLogout}
          >
            <Text className="text-red-600 text-center font-bold text-lg">Cerrar Sesión</Text>
          </Pressable>

          <Pressable
            className="mt-4 mb-8"
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