import { Feather } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

import { UserData } from '../types/type';

import { useAuth } from '~/context/AuthContext';

const EditAccountScreen = () => {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      setUser(authUser as UserData);
    }
  }, [authUser]);

  const handleUpdate = async () => {
    Alert.alert('Success', 'Profile updated successfully');
  };

  const onChangeName = (value: string) => {
    setUser((prevUser) => {
      if (prevUser) {
        return typeof prevUser.name === 'string'
          ? { ...prevUser, name: value }
          : { ...prevUser, name: { ...prevUser.name, firstname: value } };
      }
      return null;
    });
  };
  const onChangeFirstName = (value: string) => {
    setUser((prevUser) => {
      if (prevUser && typeof prevUser.name === 'object') {
        return { ...prevUser, name: { ...prevUser.name, firstname: value } };
      }
      return prevUser;
    });
  };

  const onChangeLastName = (value: string) => {
    setUser((prevUser) => {
      if (prevUser && typeof prevUser.name === 'object') {
        return { ...prevUser, name: { ...prevUser.name, lastname: value } };
      }
      return prevUser;
    });
  };
  const onChangeUsername = (value: string) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, username: value } : null));
  };
  const onChangeEmail = (value: string) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, email: value } : null));
  };
  const onChangePhone = (value: string) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, phone: value } : null));
  };

  const onChangeStreet = (value: string) => {
    setUser((prevUser) =>
      prevUser && prevUser.address
        ? { ...prevUser, address: { ...prevUser.address, street: value } }
        : prevUser
    );
  };

  const onChangeNumber = (value: string) => {
    setUser((prevUser) =>
      prevUser && prevUser.address
        ? { ...prevUser, address: { ...prevUser.address, number: parseInt(value, 10) } }
        : prevUser
    );
  };

  const onChangeCity = (value: string) => {
    setUser((prevUser) =>
      prevUser && prevUser.address
        ? { ...prevUser, address: { ...prevUser.address, city: value } }
        : prevUser
    );
  };
  const onChangeZipcode = (value: string) => {
    setUser((prevUser) =>
      prevUser && prevUser.address
        ? { ...prevUser, address: { ...prevUser.address, zipcode: value } }
        : prevUser
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleUpdate} className="p-2">
              <Feather name="check" size={24} color="black" />
            </TouchableOpacity>
          ),
          title: 'Edit Profile',
        }}
      />
      <ScrollView className="flex-1 p-4">
        {typeof user.name === 'string' ? (
          <View className="mb-4">
            <Text className="mb-2 font-semibold">Name:</Text>
            <TextInput
              value={user.name}
              onChangeText={onChangeName}
              className="rounded-md border border-gray-300 p-2"
            />
          </View>
        ) : (
          <View>
            <View className="mb-4">
              <Text className="mb-2 font-semibold">First Name:</Text>
              <TextInput
                value={user.name.firstname}
                onChangeText={onChangeFirstName}
                className="rounded-md border border-gray-300 p-2"
              />
            </View>
            <View className="mb-4">
              <Text className="mb-2 font-semibold">Last Name:</Text>
              <TextInput
                value={user.name.lastname}
                onChangeText={onChangeLastName}
                className="rounded-md border border-gray-300 p-2"
              />
            </View>
          </View>
        )}

        <View className="mb-4">
          <Text className="mb-2 font-semibold">Username:</Text>
          <TextInput
            value={user.username || ''}
            onChangeText={onChangeUsername}
            className="rounded-md border border-gray-300 p-2"
          />
        </View>
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Email:</Text>
          <TextInput
            value={user.email || ''}
            onChangeText={onChangeEmail}
            className="rounded-md border border-gray-300 p-2"
            keyboardType="email-address"
          />
        </View>
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Phone:</Text>
          <TextInput
            value={user.phone || ''}
            onChangeText={onChangePhone}
            className="rounded-md border border-gray-300 p-2"
            keyboardType="phone-pad"
          />
        </View>
        <View className="mb-4">
          <Text className="mb-2 font-semibold">Address</Text>
          <Text className="mb-1 font-semibold text-gray-500">Street:</Text>
          <TextInput
            value={user.address?.street || ''}
            onChangeText={onChangeStreet}
            className="mb-2 rounded-md border border-gray-300 p-2"
          />
          <Text className="mb-1 font-semibold text-gray-500">Number:</Text>
          <TextInput
            value={(user.address?.number || '').toString()}
            onChangeText={onChangeNumber}
            className="mb-2 rounded-md border border-gray-300 p-2"
            keyboardType="number-pad"
          />
          <Text className="mb-1 font-semibold text-gray-500">City:</Text>
          <TextInput
            value={user.address?.city || ''}
            onChangeText={onChangeCity}
            className="rounded-md border border-gray-300 p-2"
          />
          <Text className="mb-1 font-semibold text-gray-500">Zipcode:</Text>
          <TextInput
            value={user.address?.zipcode || ''}
            onChangeText={onChangeZipcode}
            className="rounded-md border border-gray-300 p-2"
          />
        </View>
      </ScrollView>
    </>
  );
};

export default EditAccountScreen;
