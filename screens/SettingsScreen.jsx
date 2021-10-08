import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthProvider';

export default function SettingsScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
