import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import LoginPage from "./components/Login";
import Posts from "./components/Posts";
import StartVideoCall from "./components/StartVideoCall";
import VideoCall from "./components/VideoCall";
import axios from "axios";

axios.defaults.baseURL = "http://192.168.1.2:3000";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Separate stack navigator for video-related screens
const VideoStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="StartVideo" 
        component={StartVideoCall}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VideoCall" 
        component={VideoCall}
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal',
          animationEnabled: true
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Posts"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Login") {
                iconName = "log-in-outline";
              } else if (route.name === "Posts") {
                iconName = "list-outline";
              } else if(route.name === "Video") {
                iconName = "videocam-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              height: 60,
              paddingBottom: 8,
            },
            // Hide tab bar when in video call
            tabBarStyle: ({ route }) => ({
              height: 60,
              paddingBottom: 8,
              display: route.name === "VideoCall" ? "none" : "flex"
            })
          })}
        >
          <Tab.Screen name="Login" component={LoginPage} />
          <Tab.Screen name="Posts" component={Posts} />
          <Tab.Screen 
            name="Video" 
            component={VideoStack}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});