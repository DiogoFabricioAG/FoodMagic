import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      initialRouteName="camera"
      screenOptions={{
        tabBarActiveTintColor: '#D32F2F',
        tabBarInactiveTintColor: '#9E9E9E',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#FFEBEE',
          height: Platform.OS === 'ios' ? 90 : 70 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 25 : Math.max(insets.bottom, 10),
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#D32F2F',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Rubik',
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Detectar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ingredientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="basket" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Para Ti',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
