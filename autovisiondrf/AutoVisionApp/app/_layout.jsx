import React from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../store/authStore';

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F5F7' }}>
        <ActivityIndicator color="#E8500A" size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="index" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}