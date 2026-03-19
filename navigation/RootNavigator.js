import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import PetDetailScreen from '../screens/PetDetailScreen';
import AdoptionFormScreen from '../screens/AdoptionFormScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import PetListScreen from '../screens/PetListScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="PetList" component={PetListScreen} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
      <Stack.Screen name="AdoptionForm" component={AdoptionFormScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
}

