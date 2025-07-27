import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Evitar que el usuario vuelva atrás desde login
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
