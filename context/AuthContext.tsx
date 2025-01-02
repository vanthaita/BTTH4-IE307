import * as Crypto from 'expo-crypto';
import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useState } from 'react';

import { UserData } from '~/app/types/type';

interface AuthContextType {
  token: string | null;
  user: UserData | null;
  isLogged: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: UserData) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isLogged: false,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
});

const generateToken = async (userId: string) => {
  const data = JSON.stringify({ id: userId });
  const signature = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data, {
    encoding: Crypto.CryptoEncoding.BASE64,
  });

  return `${data}.${signature}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  
  const login = async () => {
    try {
      const randomId = Math.floor(Math.random() * 9) + 1;
      const userId = String(randomId);
      const newToken = await generateToken(userId);
      setToken(newToken);
      const decodedToken = JSON.parse(newToken.split('.')[0]) as { id: string };
      const apiUrl = `https://fakestoreapi.com/users/${decodedToken.id}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: UserData = await response.json();
      setUser(data);
      setIsLogged(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsLogged(false);
  };

  const updateUser = (userData: UserData) => {
    setUser(userData);
  };

  const value = {
    token,
    user,
    isLogged,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
