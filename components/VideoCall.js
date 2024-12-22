import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import Daily from "@daily-co/react-native-daily-js";

const VideoCall = () => {
  const callRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomUrl = 'https://campusify.daily.co/tanish69'; 
  const displayName = "Tanish"; 

  useEffect(() => {
    callRef.current = Daily.createCallObject({
      url: roomUrl,
      allowMultipleCallInstances: true,
    });

   
    callRef.current
      .join({ userName: displayName })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to join call:", error);
        setError("Failed to join the call. Please try again later.");
        setIsLoading(false);
      });

    return () => {
      if (callRef.current) {
        callRef.current.leave();
        callRef.current.destroy();
      }
    };
  }, [roomUrl]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {callRef.current && (
        <Daily.CallObjectView callObject={callRef.current} style={styles.video} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    flex: 1,
    borderRadius: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default VideoCall;
