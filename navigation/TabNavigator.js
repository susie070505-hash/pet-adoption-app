import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const tabBarStyle = {
  position: 'absolute',
  height: 70,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  backgroundColor: '#FFFFFF',
  borderTopWidth: 0,
  paddingBottom: 8,
  paddingTop: 8,
  elevation: 12
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: '#C55A2B',
        tabBarInactiveTintColor: '#B9B3AA',
        tabBarIcon: ({ color, size, focused }) => {
          size = focused ? 26 : 22;
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          }
          if (route.name === 'Favorites') {
            return <Ionicons name="heart" size={size} color={color} />;
          }
          if (route.name === 'Messages') {
            return <Ionicons name="chatbubbles" size={size} color={color} />;
          }
          if (route.name === 'Profile') {
            return <MaterialIcons name="person" size={size} color={color} />;
          }
          return null;
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: '收藏' }}
      />
      <Tab.Screen
        name="Messages"
        component={ChatListScreen}
        options={{ title: '消息' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
}

