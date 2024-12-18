import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { Avatar, Button, Card } from "react-native-elements";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import CreatePost from "./CreatePost";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState("all");
  const [allCommunities, setAllCommunities] = useState([]);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const tagsStyles = {
    a: { color: "blue", textDecorationLine: "underline" },
    b: { fontWeight: "bold" },
    i: { fontStyle: "italic" },
    img: {
      width: "80%",
      height: "auto",
    },
    "span.ql-size-small": {
      fontSize: 12,
    },
    "span.ql-size-large": {
      fontSize: 20,
    },
    "span.ql-size-huge": {
      fontSize: 28,
    },
  };

  const fetchPosts = async (pageParam = page) => {
    try {
      let collegeId = selectedCommunity === "all" ? null : selectedCommunity;
      const response = await axios.post(
        "/api/post/fetch",
        {
          page: pageParam,
          collegeId,
        },
        {
          withCredentials: true,
        }
      );
      const fetchedPosts = response.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      if (response.data.isOver) {
        setHasMore(false);
      }
      setPage(pageParam + 1);
    } catch (err) {
      Alert.alert("Error", "Error fetching posts");
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [selectedCommunity]);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/post/communities", {
          withCredentials: true,
        });
        setCommunities(response.data.college);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Alert.alert("Error", "Error fetching communities");
      }
    };

    fetchCommunities();
    fetchPosts();
  }, []);

  // const renderers = {
  //   img: (htmlAttribs) => {
  //     const { src } = htmlAttribs;
  //     return (
  //       <Image
  //         source={{ uri: src }}
  //         style={{
  //           width: width * 0.9,
  //           height: 'auto',
  //           resizeMode: 'contain',
  //         }}
  //       />
  //     );
  //   },
  // };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  const renderPost = ({ item: post }) => (
    <TouchableOpacity style={styles.postCard}>
      <View style={styles.postHeader}>
        <Avatar
          rounded
          source={{ uri: post.User.pic }}
          size="medium"
          containerStyle={styles.avatar}
        />
        <Text style={styles.postTitle}>{post.title}</Text>
      </View>
      <Text style={styles.postMeta}>{post.College.name}</Text>
      <Text style={styles.postMeta}>@{post.User.username}</Text>
      <View style={styles.container}>
        <RenderHTML
          contentWidth={width}
          // renderers={renderers}

          renderersProps={renderersProps}
          source={{ html: post.content }}
          tagsStyles={tagsStyles}
          defaultTextProps={{
            selectable: true,
          }}
        />
      </View>
      <View style={styles.postFooter}>
        <Text style={styles.postLikes}>{post.likes} likes</Text>
        <Text style={styles.postComments}>
          {post._count?.Comments} comments
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handlePostSubmit = async ({ title, content, community }) => {
    try {
      const response = await axios.post(
        "/api/post/create",
        {
          title: title,
          content: content,
          collegeId: community,
        },
        { withCredentials: true }
      );

      Alert.alert("Success", "Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert(
        "Error",
        "There was an issue creating your post. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.createPostContainer}></View> */}
      <CreatePost communities={communities} onSubmit={handlePostSubmit} />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.post_id.toString()}
        onEndReached={() => hasMore && fetchPosts()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={hasMore ? <ActivityIndicator /> : null}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No posts to show</Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <CreatePost communities={communities} onSubmit={handlePostSubmit} />
          </View>
        }
        contentContainerStyle={{ paddingTop: 0 }}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  postCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    marginRight: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postMeta: {
    fontSize: 14,
    color: "gray",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  postLikes: {
    fontSize: 14,
    color: "blue",
  },
  postComments: {
    fontSize: 14,
    color: "green",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  boldText: {
    fontWeight: "bold",
  },
  italicText: {
    fontStyle: "italic",
  },
});

export default Posts;
