/**
 * Todo App - React Native
 * A modern React Native todo application with user authentication, todo management, and profile customization features.
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StatusBar,
  useColorScheme,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuthStore } from './stores/authStore';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

type Screen = 'home' | 'profile';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { currentUser, signOut } = useAuthStore();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // If user is not authenticated, show auth screen
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AuthScreen />
      </SafeAreaView>
    );
  }

  // If user is authenticated, show main app with tab navigation
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'profile':
        return <ProfileScreen onLogout={() => signOut()} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        {renderCurrentScreen()}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, currentScreen === 'home' && styles.activeTab]}
            onPress={() => setCurrentScreen('home')}
          >
            <Icon
              name={currentScreen === 'home' ? 'home' : 'home-outline'}
              size={24}
              color={currentScreen === 'home' ? '#007AFF' : '#8E8E93'}
            />
            <Text
              style={[
                styles.tabText,
                currentScreen === 'home' && styles.activeTabText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              currentScreen === 'profile' && styles.activeTab,
            ]}
            onPress={() => setCurrentScreen('profile')}
          >
            <Icon
              name={currentScreen === 'profile' ? 'person' : 'person-outline'}
              size={24}
              color={currentScreen === 'profile' ? '#007AFF' : '#8E8E93'}
            />
            <Text
              style={[
                styles.tabText,
                currentScreen === 'profile' && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 34, // Safe area for iPhone
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  activeTabText: {
    color: '#007AFF',
  },
});

export default App;
