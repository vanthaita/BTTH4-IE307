import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '~/context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (username === 'test' && password === 'password') {
        await login();
        router.replace('/(tabs)');
        return;
      }
      Alert.alert('Login Failed', 'Invalid username or password');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login button pressed');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook login button pressed');
  };

  return (
    <SafeAreaView className="relative flex-1 items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <View className="relative z-10 w-full p-4">
        <View className="mb-6 items-center">
          <Image
            source={{
              uri: 'https://img.freepik.com/free-vector/app-concept-illustration_114360-890.jpg?w=740&t=st=1717137202~exp=1717137802~hmac=a91aa7a2a418871732024a8204361d1478489502734ff0a3bf95e244e1118a1b',
            }}
            className="h-20 w-20"
            resizeMode="contain"
          />
          <Text className="mt-2 text-2xl font-bold text-gray-800">Store Fake</Text>
        </View>

        <View className="gap-4">
          <View className="relative">
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              className="rounded-md border border-gray-300 bg-white p-4 pl-12 transition-colors duration-200 focus:border-blue-500"
            />
            <Feather name="user" size={20} color="gray" className="absolute left-4 top-4" />
          </View>
          <View className="relative">
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="rounded-md border border-gray-300 bg-white p-4 pl-12 transition-colors duration-200 focus:border-blue-500"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4">
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
            </TouchableOpacity>
            <Feather name="lock" size={20} color="gray" className="absolute left-4 top-4" />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="mt-6 items-center justify-center rounded-full bg-blue-600 py-4 shadow-sm hover:bg-blue-700 active:bg-blue-800">
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-semibold text-white">Log In</Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 space-y-3">
          <View className="relative border-t border-gray-300">
            <Text className="absolute -top-3 left-1/2 -translate-x-1/2 transform bg-white px-2 text-sm text-gray-500">
              Or continue with
            </Text>
          </View>

          <View className="mt-4 flex-row justify-between">
            <TouchableOpacity
              onPress={handleGoogleLogin}
              className="mr-2 flex-1 items-center justify-center rounded-full border border-gray-300 px-4 py-3">
              <Image
                source={{
                  uri: 'https://img.icons8.com/color/48/000000/google-logo.png',
                }}
                className="h-6 w-6"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFacebookLogin}
              className="ml-2 flex-1 items-center justify-center rounded-full border border-gray-300 px-4 py-3">
              <Image
                source={{
                  uri: 'https://img.icons8.com/color/48/000000/facebook-new.png',
                }}
                className="h-6 w-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity className="mt-4 items-center">
          <Text className="text-gray-600">
            Don't have an account? <Text className="font-semibold text-blue-600">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
