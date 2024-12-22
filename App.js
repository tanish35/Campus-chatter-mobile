import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LoginPage from "./components/Login";
import Posts from "./components/Posts";
import axios from "axios";

axios.defaults.baseURL = "http://192.168.1.2:3000";

const Tab = createBottomTabNavigator();

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
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              height: 60,
              paddingBottom: 8,
            },
          })}
        >
          <Tab.Screen name="Login" component={LoginPage} />
          <Tab.Screen name="Posts" component={Posts} />
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
