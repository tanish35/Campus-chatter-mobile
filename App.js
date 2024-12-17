import React from 'react';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './components/Login';
import Posts from './components/Posts';
import axios from 'axios';

// Set Axios base URL
axios.defaults.baseURL = "http://192.168.29.99:3000";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GluestackUIProvider mode="light"><NavigationContainer>
        <Stack.Navigator initialRouteName="Posts">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Posts" component={Posts} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer></GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
