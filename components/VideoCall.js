// import { useEffect, useRef, useState } from "react";
// import { View, StyleSheet, ActivityIndicator, ToastAndroid } from "react-native";
// import Daily from "@daily-co/react-native-daily-js";
// import { useUser } from "./hook/useUser";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import axios from "axios";

// const VideoCall = () => {
//   const callRef = useRef(null);
//   const { userDetails, loadingUser } = useUser();
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { id } = route.params;
//   const [isLoading, setIsLoading] = useState(true);

//   const roomUrl = `https://campusify.daily.co/${id}`;
//   const username = userDetails?.username;

//   useEffect(() => {
//     if (loadingUser) {
//       setIsLoading(true);
//     } else {
//       setIsLoading(false);
//       if (!userDetails) {
//         ToastAndroid.show("Please sign in first", ToastAndroid.LONG);
//         navigation.navigate("Login");
//       }
//     }
//   }, [loadingUser, userDetails, navigation]);

//   useEffect(() => {
//     if (!isLoading && username) {
//       callRef.current = Daily.createCallObject({
//         keepDeviceAwake: true,
//       });

//       // Set event listeners
//       callRef.current.on("left-meeting", handleLeaveMeeting);

//       // Join the call
//       callRef.current
//         .join({ url: roomUrl, userName: username })
//         .catch((error) => console.error("Failed to join call:", error));
//     }

//     return () => {
//       if (callRef.current) {
//         callRef.current.leave();
//         callRef.current.destroy();
//       }
//     };
//   }, [roomUrl, username, isLoading]);

//   const handleLeaveMeeting = async () => {
//     const videoId = roomUrl.split("/").pop();
//     try {
//       const response = await axios.delete("/api/video/deleteroom", {
//         data: { video_id: videoId },
//       });
//       console.log(response.data.message);
//     } catch (error) {
//       console.error("Failed to delete room:", error);
//     }
//   };

//   if (isLoading || !callRef.current) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#00ff00" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Daily.CallObjectView callObject={callRef.current} style={styles.video} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   video: {
//     flex: 1,
//     borderRadius: 0,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "black",
//   },
// });

// export default VideoCall;


import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, ToastAndroid } from "react-native";
import Daily from "@daily-co/react-native-daily-js";

// Singleton pattern for Daily instance management
const DailyManager = {
  instance: null,
  async cleanup() {
    if (this.instance) {
      try {
        await this.instance.leave().catch(() => {});
        await this.instance.destroy();
      } catch (e) {
        console.error('Cleanup error:', e);
      }
      this.instance = null;
    }
  },
  async getInstance() {
    // Always clean up before creating new instance
    await this.cleanup();
    this.instance = Daily.createCallObject();
    return this.instance;
  }
};

const VideoCall = () => {
  const roomUrl = "https://campusify.daily.co/tanish69";
  const [isLoading, setIsLoading] = useState(true);
  const [callObject, setCallObject] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const setupCall = async () => {
      try {
        // Get a fresh instance
        const dailyInstance = await DailyManager.getInstance();
        
        if (!isMounted) {
          await DailyManager.cleanup();
          return;
        }

        // Set call object before joining
        setCallObject(dailyInstance);

        // Configure and join
        const joinConfig = {
          url: roomUrl,
          subscribeToTracksAutomatically: true,
          userName: 'User'  // Optional: Add a username
        };

        await dailyInstance.join(joinConfig);
        
        if (isMounted) {
          console.log("Successfully joined call");
        }
      } catch (error) {
        console.error("Call setup error:", error);
        if (isMounted) {
          ToastAndroid.show(
            `Failed to join call: ${error.message}`,
            ToastAndroid.LONG
          );
        }
        await DailyManager.cleanup();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Run setup
    setupCall();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      DailyManager.cleanup();
    };
  }, []);

  // Error handling for the CallObjectView
  const handleCallError = (error) => {
    console.error('CallObjectView error:', error);
    ToastAndroid.show('Video call error: ' + error.message, ToastAndroid.LONG);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {callObject && (
        <Daily.CallObjectView 
          callObject={callObject} 
          style={styles.video}
          onError={handleCallError}
        />
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
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});

// Ensure cleanup when component is hot reloaded during development
if (module.hot) {
  module.hot.dispose(() => {
    DailyManager.cleanup();
  });
}

export default VideoCall;