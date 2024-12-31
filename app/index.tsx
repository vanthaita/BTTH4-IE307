import { Href, Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '~/context/AuthContext';

const Page = () => {
  const { isLogged } = useAuth();
  return <Redirect href={isLogged ? '/(tabs)' : ('/(auth)/login' as Href)} />;
};

export default Page;