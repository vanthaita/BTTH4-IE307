// Tạ Văn Thái
// 22521377
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

import { useCart } from '~/context/CartContext';

export default function TabLayout() {
  const { cartItems } = useCart();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'categories':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'cart' && cartItems.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: '#f18b2f',
                    borderRadius: 10,
                    minWidth: 15,
                    height: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {cartItems.length}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarStyle: { backgroundColor: 'white' },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
