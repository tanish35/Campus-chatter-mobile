import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useUser } from "./hook/useUser";

const StartVideoCall = () => {
  const navigation = useNavigation();
  const { userDetails, loadingUser } = useUser();

  const [isLoading, setIsLoading] = useState(loadingUser);
  const [roomUrl, setRoomUrl] = useState(""); // URL for the created room
  const [joinRoomUrl, setJoinRoomUrl] = useState(""); // URL for joining a room

  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loadingUser) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (!userDetails) {
        alert("Please sign in first");
        navigation.navigate("Login");
      }
    }
  }, [loadingUser, userDetails]);

  const createRoom = async () => {
    try {
      const response = await axios.post("/api/video/createroom");
      if (response.status === 205) {
        navigation.navigate("Video", { roomId: userDetails.username });
        return;
      }
      setRoomUrl(response.data.url);
      setJoinRoomUrl("");
      navigation.navigate("VideoCall", {
        roomId: response.data.url.split("/").pop(),
      });
    } catch (error) {
      console.error("Failed to create room", error);
      alert("Error creating room");
    }
  };

  const handleUrlChange = (text) => {
    setJoinRoomUrl(text);
  };

  const handleJoinRoom = () => {
    if (joinRoomUrl) {
      setRoomUrl(joinRoomUrl);
      setJoinRoomUrl("");
      navigation.navigate("VideoCall", {
        roomId: joinRoomUrl.split("/").pop(),
      });
    } else {
      alert("Please enter a valid room URL");
    }
  };

  useEffect(() => {
    if (!isLoading) {
      Animated.spring(buttonAnimation, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {roomUrl ? "Join the Video Call" : "Ready to Start a Video Call?"}
      </Text>
      <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
        <TouchableOpacity style={styles.button} onPress={createRoom}>
          <Text style={styles.buttonText}>Start Video Call</Text>
        </TouchableOpacity>
      </Animated.View>
      <TextInput
        style={styles.input}
        placeholder="Enter Room URL"
        value={joinRoomUrl}
        onChangeText={handleUrlChange}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
        <Text style={styles.buttonText}>Join Video Call</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartVideoCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4FD1C5", // Teal gradient replacement
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#319795", // Teal color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    width: "80%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
