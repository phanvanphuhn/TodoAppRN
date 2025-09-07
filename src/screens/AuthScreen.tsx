import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { BiometricService } from '../services/biometricService';

export default function AuthScreen() {
  const {
    authMode,
    setAuthMode,
    signIn,
    signUp,
    signInWithBiometric,
    biometricAvailable,
    biometricType,
    checkBiometricAvailability,
  } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  useEffect(() => {
    checkBiometricAvailability();
  }, [checkBiometricAvailability]);

  const handleAuth = () => {
    if (authMode === 'signin') {
      const success = signIn(username.trim(), password.trim());
      if (!success) {
        Alert.alert('Sign In Failed', 'Invalid username or password');
      }
    } else {
      const success = signUp(
        username.trim(),
        password.trim(),
        verifyPassword.trim(),
      );
      if (success) {
        // Keep username and password filled for immediate sign in
        setVerifyPassword(''); // Only clear verify password
        setAuthMode('signin');
        Alert.alert(
          'Success',
          'Account created successfully! You can now sign in.',
        );
      } else {
        Alert.alert(
          'Sign Up Failed',
          'Username already exists or validation failed. Please try again.',
        );
      }
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await signInWithBiometric();
      if (!success) {
        Alert.alert(
          'Biometric Authentication Failed',
          'Please try again or use your username and password.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication is not available.');
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setUsername('');
    setPassword('');
    setVerifyPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {authMode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Verify Password"
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {authMode === 'signin' && biometricAvailable && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricAuth}
          >
            <Text style={styles.biometricButtonText}>
              🔐 Use {BiometricService.getBiometryTypeName(biometricType || '')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.toggleButton} onPress={toggleAuthMode}>
          <Text style={styles.toggleText}>
            {authMode === 'signin'
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  biometricButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
