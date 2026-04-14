import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

import './global.css';

const queryClient = new QueryClient();

const RootLayout = () => {
    
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('white');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login/index" />
        <Stack.Screen name="auth/register/index" />
        <Stack.Screen name="products/index" />
        <Stack.Screen name="profile/index" />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;
