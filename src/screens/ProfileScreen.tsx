import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { BiometricService } from '../services/biometricService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';

interface ProfileScreenProps {
  onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const {
    currentUser,
    updateAvatar,
    toggleBiometric,
    biometricAvailable,
    biometricType,
  } = useAuthStore();

  const [biometricEnabled, setBiometricEnabled] = useState(
    currentUser?.biometricEnabled || false,
  );

  const handleBiometricToggle = async (value: boolean) => {
    try {
      const success = await toggleBiometric(value);
      if (success) {
        setBiometricEnabled(value);
        Alert.alert(
          'Success',
          value
            ? `${BiometricService.getBiometryTypeName(
                biometricType || '',
              )} authentication enabled`
            : 'Biometric authentication disabled',
        );
      } else {
        Alert.alert('Error', 'Failed to update biometric settings');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update biometric settings');
    }
  };

  const onUploadAvatar = () => {
    // Show action sheet to choose between camera and library
    Alert.alert('Select Avatar', 'Choose how you want to upload your avatar', [
      {
        text: 'Camera',
        onPress: () => pickImage('camera'),
      },
      {
        text: 'Photo Library',
        onPress: () => pickImage('library'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const pickImage = (source: 'camera' | 'library') => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    if (source === 'camera') {
      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          updateAvatar(response.assets[0].uri || '');
        }
      });
    } else {
      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          updateAvatar(response.assets[0].uri || '');
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={onUploadAvatar}
      >
        {currentUser?.avatar ? (
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatarImage}
          />
        ) : (
          <Icon name="human-male" size={80} color="black" />
        )}
        <View style={styles.cameraButton}>
          <AntDesign name="pluscircle" size={24} color="black" />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{currentUser?.username}</Text>

      {biometricAvailable && (
        <View style={styles.biometricSettings}>
          <View style={styles.biometricRow}>
            <Icon name="fingerprint" size={24} color="#007AFF" />
            <Text style={styles.biometricLabel}>
              {BiometricService.getBiometryTypeName(biometricType || '')}{' '}
              Authentication
            </Text>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor={biometricEnabled ? '#fff' : '#fff'}
            />
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <AntDesign name="logout" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 99,
    backgroundColor: 'cyan',
    height: 160,
    width: 160,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 16,
    right: 8,
  },
  avatarImage: {
    width: 160,
    height: 160,
    borderRadius: 99,
  },
  biometricSettings: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  biometricLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
