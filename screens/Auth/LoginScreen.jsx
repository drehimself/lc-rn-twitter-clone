import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthProvider';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        placeholderTextColor="gray"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        placeholderTextColor="gray"
        autoCapitalize="none"
        secureTextEntry={true}
      />
      <Button onPress={() => login(email, password)} title="Login" />
      <Button
        onPress={() => navigation.navigate('Register Screen')}
        title="Go to Register Screen"
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {isLoading && (
        <ActivityIndicator style={{ marginTop: 8 }} size="small" color="gray" />
      )}
    </View>
  );
}
