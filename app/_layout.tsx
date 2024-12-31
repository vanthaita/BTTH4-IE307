import { CartProvider } from '~/context/CartContext';
import '../global.css';

import { Stack } from 'expo-router';

import { AuthProvider } from '~/context/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen
            name="products/[productId]"
            options={({ route }) => {
              const { title } = route.params as { title: string };
              return {
                headerShown: true,
                title: `${title}`,
                headerStyle: { backgroundColor: '#f7c6a3' },
              };
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
