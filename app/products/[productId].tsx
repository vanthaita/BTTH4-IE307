import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { Product } from '../types/type';

import { useCart } from '~/context/CartContext';

const ProductDetails: React.FC = () => {
  const params = useLocalSearchParams<{ productId: string }>();
  const productId = params.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        Alert.alert('Error', 'Unable to fetch product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = (product: Product) => {
    if (product) {
      addToCart({
        id: product.id.toString(),
        name: product.title,
        price: product.price,
        imageUrl: product.image,
        quantity: 1,
      });
      Alert.alert('Product Added to Cart', 'This product has been added to your cart!');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#f18b2f" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-xl font-semibold text-gray-700">Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="mx-4 mt-5 items-center rounded-lg bg-white p-4 shadow-md">
        <Image source={{ uri: product.image }} className="h-52 w-52" resizeMode="contain" />
      </View>

      <View className="mx-4 mt-5 p-4">
        <Text className="text-2xl font-bold text-gray-800">{product.title}</Text>
        <Text className="mt-2 text-xl font-semibold text-orange-500">
          ${product.price.toFixed(2)}
        </Text>
        <Text className="mt-1 text-sm font-medium uppercase text-gray-600">
          {product.category || 'Uncategorized'}
        </Text>
      </View>

      <View className="mx-4 mt-5 rounded-lg bg-white p-4 shadow-md">
        <Text className="text-base leading-6 text-gray-700">{product.description}</Text>
      </View>

      <View className="mx-4 mt-5 flex-row items-center p-4">
        <View className="flex-row">
          {Array.from({ length: 5 }).map((_, index) => (
            <FontAwesome
              key={index}
              name={index < Math.round(product.rating?.rate || 0) ? 'star' : 'star-o'}
              size={16}
              color="#f18b2f"
            />
          ))}
        </View>
        <Text className="ml-2 text-sm text-gray-600">
          {product.rating?.rate?.toFixed(1) || 'N/A'} ★ ({product.rating?.count || 0} reviews)
        </Text>
      </View>

      <View className="mx-4 mt-5 p-4">
        <TouchableOpacity
          className="items-center rounded-lg bg-orange-500 p-3 shadow-md"
          onPress={() => handleAddToCart(product)}>
          <Text className="text-base font-semibold text-white">Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-3 items-center rounded-lg bg-gray-200 p-3"
          onPress={() =>
            Alert.alert('Added to Favorites', 'This product has been added to your favorites!')
          }>
          <Text className="text-base font-semibold text-gray-800">Add to Favorites</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;
