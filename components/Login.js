import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/user/login", 
        { email, password }, 
        { withCredentials: true }
      );
      setLoading(false);
      if (response.status === 201) {
        alert("Email not verified. Please check your email for verification.");
      } else {
        alert("Login successful! Redirecting to posts page.");
        navigation.navigate("Posts"); 
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>Welcome, Sign in to continue</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
          <Text style={styles.forgotPassword} onPress={() => navigation.navigate('ForgetPassword')}>Forgot Password?</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  forgotPassword: {
    marginTop: 15,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default LoginPage;
