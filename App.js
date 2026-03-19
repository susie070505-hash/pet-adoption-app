import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './navigation/RootNavigator';
import { AppProvider } from './context/AppContext';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF7F1'
  }
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer theme={MyTheme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

