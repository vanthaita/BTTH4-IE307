import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartItem } from '../types/type';

import { useCart } from '~/context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'delete' | 'decrease'>('delete');
  const [itemToDeleteOrDecrease, setItemToDeleteOrDecrease] = useState<CartItem | null>(null);
  const router = useRouter();
  const [quantityAnimations, setQuantityAnimations] = useState<{
    [itemId: string]: Animated.Value;
  }>({});

  const handleIncreaseQuantity = (item: CartItem) => {
    const newQuantity = item.quantity + 1;
    updateCartItemQuantity(item.id, newQuantity);
    animateQuantityChange(item.id);
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity === 1) {
      setItemToDeleteOrDecrease(item);
      setModalType('decrease');
      setShowModal(true);
    } else {
      const newQuantity = item.quantity - 1;
      updateCartItemQuantity(item.id, newQuantity);
      animateQuantityChange(item.id);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    removeFromCart(itemId);
    setShowModal(false);
  };

  const handleShowModal = (item: CartItem) => {
    setItemToDeleteOrDecrease(item);
    setModalType('delete');
    setShowModal(true);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const animateQuantityChange = (itemId: string) => {
    if (!quantityAnimations[itemId]) {
      quantityAnimations[itemId] = new Animated.Value(1);
    }
    Animated.sequence([
      Animated.timing(quantityAnimations[itemId], {
        toValue: 1.2,
        duration: 80,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(quantityAnimations[itemId], {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4">
        {cartItems.length > 0 ? (
          <View className="flex-1">
            <ScrollView className="mb-2">
              {cartItems.map((item) => (
                <View
                  key={item.id}
                  className="relative mb-4 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-md">
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="h-20 w-20 rounded shadow-sm"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                    }}
                  />
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-semibold">{item.name}</Text>
                    <Text className="text-sm text-gray-500">{`$${item.price.toFixed(2)}`}</Text>
                    <View className="mt-2 flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => handleIncreaseQuantity(item)}
                        className=" rounded-full bg-blue-500 p-2 text-white">
                        <Feather name="plus" size={20} color="white" />
                      </TouchableOpacity>
                      <Animated.Text
                        style={{
                          transform: [{ scale: quantityAnimations[item.id] || 1 }],
                        }}
                        className="mx-2 text-lg font-semibold">
                        {item.quantity}
                      </Animated.Text>
                      <TouchableOpacity
                        onPress={() => handleDecreaseQuantity(item)}
                        className="rounded-full bg-blue-500 p-2 text-white">
                        <Feather name="minus" size={20} color="white" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleShowModal(item)}
                        className="ml-2 rounded-lg bg-red-500 px-3 py-2 text-white">
                        <Text>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="text-lg font-semibold">{`$${(item.price * item.quantity).toFixed(
                    2
                  )}`}</Text>
                </View>
              ))}
            </ScrollView>
            <View className="fixed bottom-0 left-0 right-0 rounded-t-lg bg-white p-4 shadow-lg">
              <Text className="mb-2 text-xl font-semibold">
                Total: ${calculateTotal().toFixed(2)}
              </Text>
              <TouchableOpacity
                // onPress={() => router.push('/checkout')}
                className="mt-2 rounded-lg bg-green-500 py-3 shadow-md">
                <Text className="text-center text-lg text-white">Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="mb-4 text-xl text-gray-500">Your cart is empty</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              className="mt-6 rounded-lg bg-blue-500 py-3 shadow-md">
              <Text className="text-center text-lg text-white">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
        {showModal && itemToDeleteOrDecrease && (
          <Modal transparent visible={showModal} animationType="fade">
            <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
              <View className="w-3/4 rounded-lg bg-white p-6">
                <Text className="mb-6 text-center text-xl font-semibold">
                  {modalType === 'delete'
                    ? 'Are you sure you want to delete this item?'
                    : 'Are you sure you want to remove this item?'}
                </Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={() =>
                      modalType === 'delete'
                        ? handleDeleteItem(itemToDeleteOrDecrease.id)
                        : handleDeleteItem(itemToDeleteOrDecrease.id)
                    }
                    className="mx-1 flex-1 rounded-lg bg-red-500 py-3 shadow-md">
                    <Text className="text-center text-white">
                      {modalType === 'delete' ? 'Delete' : 'Remove'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    className="mx-1 flex-1 rounded-lg bg-gray-500 py-3 shadow-md">
                    <Text className="text-center text-white">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Cart;
