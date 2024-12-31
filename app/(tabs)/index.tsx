import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useCart } from '~/context/CartContext';
import { Product } from '../types/type';



interface Banner {
  id: string;
  image: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setBanners([
      {
        id: '1',
        image:
          'https://static.vecteezy.com/system/resources/previews/011/871/820/non_2x/online-shopping-on-phone-buy-sell-business-digital-web-banner-application-money-advertising-payment-ecommerce-illustration-search-vector.jpg',
      },
      {
        id: '2',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyrd8m-qEcHBmLPaW_-mlFHA0uoh1L5MSWZA&s',
      },
      {
        id: '3',
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIKKXW_ZrJ354Q5xq_03Szh9CPxGrRwcHz9Q&s',
      },
    ]);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Unable to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id.toString(),
      name: product.title,
      price: product.price,
      imageUrl: product.image,
      quantity: 1,
    });
    Alert.alert('Product added to cart!');
  };

  const handleClickProduct = (id: string | number, title: string) => {
    router.push({
      pathname: '/products/[productId]',
      params: { productId: id, title },
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View
      className="m-2 flex-1 items-center rounded-lg bg-white p-4 shadow-md"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}>
      <TouchableOpacity onPress={() => handleClickProduct(item.id, item.title)}>
        <Image source={{ uri: item.image }} className="mb-4 h-40 w-[150px]" />
        <Text className="mb-2 text-center text-sm font-semibold text-gray-800" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="font-bold text-orange-500">${item.price.toFixed(2)}</Text>
        <Text className="text-gray-500">
          ⭐ {item.rating?.rate || 'N/A'} | {item.rating?.count || 0} reviews
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleAddToCart(item)}
        className="mt-4 h-12 w-12 items-center justify-center rounded-full bg-orange-500 shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}>
        <Text className="text-lg font-bold text-white">+</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#f18b2f" />
      </View>
    );
  }
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-4">
        <Text className="mb-4 text-center text-3xl font-extrabold text-orange-500">
          Your Favorite Shopping App
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {banners.map((banner) => (
            <Image
              key={banner.id}
              source={{ uri: banner.image }}
              className="mr-4 h-40 w-80 rounded-lg"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            />
          ))}
        </ScrollView>

        <Text className="mb-4 text-xl font-bold text-gray-800">🔥 Hot Deals</Text>
        <FlatList
          data={products.slice(0, 4)}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
        />

        <Text className="mb-4 mt-6 text-xl font-bold text-gray-800">🆕 New Arrivals</Text>
        <FlatList
          data={products.slice(4, 8)}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

export default Home;
