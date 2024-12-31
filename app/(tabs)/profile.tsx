import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';

import { useAuth } from '~/context/AuthContext';

const ProfileInfoItem = ({
  title,
  value,
}: {
  title: string;
  value: string | undefined | { firstname: string; lastname: string };
}) => {
  const displayValue =
    typeof value === 'object' ? `${value.firstname} ${value.lastname}` : value || 'N/A';
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: '600', color: '#4a5568' }}>{title}</Text>
      <Text style={{ fontSize: 16, color: '#1a202c' }}>{displayValue}</Text>
    </View>
  );
};

const ProfileHeader = ({
  name,
  onEditPress,
}: {
  name: string | { firstname: string; lastname: string };
  onEditPress: () => void;
}) => {
  const displayName = typeof name === 'string' ? name : `${name.firstname} ${name.lastname}`;
  return (
    <View
      style={{
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{
            uri: 'https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70.jpg',
          }}
          style={{ marginRight: 16, height: 64, width: 64, borderRadius: 32 }}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a202c' }}>{displayName}</Text>
      </View>
      <TouchableOpacity onPress={onEditPress}>
        <Feather name="edit" size={24} color="#4a5568" />
      </TouchableOpacity>
    </View>
  );
};

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => (
  <TouchableOpacity
    onPress={onLogout}
    style={{ marginTop: 24, backgroundColor: '#f56565', padding: 12, borderRadius: 8 }}>
    <Text style={{ textAlign: 'center', fontSize: 18, color: '#fff' }}>Log Out</Text>
  </TouchableOpacity>
);

const AccountScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleEditProfile = () => {
    if (user) {
      router.push('/(route)/editScreen');
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      {user ? (
        <>
          <ProfileHeader name={user.name} onEditPress={handleEditProfile} />
          <View style={{ marginTop: 16 }}>
            <ProfileInfoItem title="Name" value={user.name} />
            <ProfileInfoItem title="Username" value={user.username} />
            <ProfileInfoItem title="Email" value={user.email} />
            <ProfileInfoItem title="Phone" value={user.phone} />
            <ProfileInfoItem
              title="Address"
              value={
                user.address
                  ? `${user.address.street || ''} ${user.address.number || ''}, ${user.address.city || ''}`
                  : undefined
              }
            />
          </View>
          <LogoutButton onLogout={handleLogout} />
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#718096' }}>Please log in to see your account</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AccountScreen;
