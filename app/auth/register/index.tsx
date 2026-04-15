import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { registerAction } from '@/actions/auth/register.action';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | null }>({ text: '', type: null });

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 4000);
  };

  const onRegister = async () => {
    if (firstName.length === 0 || lastName.length === 0 || identificationNumber.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      showMessage('Por favor complete todos los campos', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('Las contraseñas no coinciden', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await registerAction({ firstName, lastName, identificationNumber, email, password, role });
      showMessage(`¡Registro exitoso! Bienvenido ${resp.data.email}`, 'success');
      // Redirect to login after success
      setTimeout(() => router.replace('/auth/login'), 2000);
    } catch (error: any) {
      showMessage(typeof error === 'string' ? error : 'Error de registro', 'error');
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

          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center shadow-lg">
              <Ionicons name="person-add-outline" size={45} color="white" />
            </View>
            <Text className="text-3xl font-bold mt-4 text-primary">Registro</Text>
            <Text className="text-gray-500 text-lg">Crea tu cuenta</Text>
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
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-gray-700 mb-2 ml-1 font-medium">Nombre</Text>
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="Nombre"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-2 ml-1 font-medium">Apellido</Text>
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="Apellido"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Identificación</Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="card-outline" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Número de cédula"
                  keyboardType="numeric"
                  value={identificationNumber}
                  onChangeText={setIdentificationNumber}
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
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Tipo de Usuario</Text>
              <View className="flex-row bg-gray-100 rounded-xl border border-gray-200">
                <Pressable
                  className={`flex-1 py-3 px-4 rounded-l-xl ${role === 'buyer' ? 'bg-primary' : 'bg-transparent'}`}
                  onPress={() => setRole('buyer')}
                >
                  <Text className={`text-center font-medium ${role === 'buyer' ? 'text-white' : 'text-gray-700'}`}>Comprador</Text>
                </Pressable>
                <Pressable
                  className={`flex-1 py-3 px-4 rounded-r-xl ${role === 'seller' ? 'bg-primary' : 'bg-transparent'}`}
                  onPress={() => setRole('seller')}
                >
                  <Text className={`text-center font-medium ${role === 'seller' ? 'text-white' : 'text-gray-700'}`}>Vendedor</Text>
                </Pressable>
              </View>
            </View>

            <View>
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

            <View>
              <Text className="text-gray-700 mb-2 ml-1 font-medium">Confirmar Contraseña</Text>
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
            onPress={onRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Registrarse</Text>
            )}
          </Pressable>

          <Pressable
            className="mt-6"
            onPress={() => router.replace('/auth/login')}
          >
            <Text className="text-primary text-center font-medium">¿Ya tienes cuenta? Inicia sesión</Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;