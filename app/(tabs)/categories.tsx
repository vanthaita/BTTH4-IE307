import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../types/type';


const Categories: React.FC = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories([
          { id: 'all', name: 'All' },
          ...res.data.map((cat: string) => ({ id: cat, name: cat })),
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);
  const handleClickProduct = (id: string | number, title: string) => {
    router.push({
      pathname: '/products/[productId]',
      params: { productId: id, title },
    });
  };
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url =
          selectedCategory === 'all'
            ? 'https://fakestoreapi.com/products'
            : `https://fakestoreapi.com/products/category/${selectedCategory}`;
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <SafeAreaView className="mb-10">
      <View className="p-4">
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`mr-3 rounded-full px-4 py-2 transition-all duration-200 ${
                selectedCategory === item.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onPress={() => setSelectedCategory(item.id)}>
              <Text className="text-center text-sm font-medium capitalize">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f18b2f" className="mt-4" />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-5 w-1/2 p-2"
              onPress={() => handleClickProduct(item.id, item.title)}>
              <View className="overflow-hidden rounded-lg bg-white shadow-md ">
                <Image source={{ uri: item.image }} className="h-40 w-full" resizeMode="contain" />
                <View className="p-3">
                  <Text className="mb-1 truncate text-lg font-semibold text-gray-800">
                    {item.title}
                  </Text>
                  <Text className="text-md font-medium text-orange-500">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;
