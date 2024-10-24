import React, { useEffect } from 'react';
import { Linking, Platform, StatusBar, SafeAreaView } from 'react-native';
import MainContainer from './navigation/MainContainer';
import { AuthProvider } from './lib/AuthContext';
import { UpdateUserScore } from './lib/UpdateUserScore';
import styles from './src/Style';

export default function App() {

  const androidPaddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    // Wrap application with auth provider which manages the current user authentication state
    <AuthProvider>
      <SafeAreaView style={{ paddingTop: androidPaddingTop }} />
        <MainContainer />
    </AuthProvider>
  );
}
