import React, { useState, useRef } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { launchImageLibrary } from 'react-native-image-picker';
import { Box } from '@/components/ui/box';
import { Input } from '@/components/ui/input';
import { FormControl } from "@/components/ui/form-control"
import { Select, SelectItem } from "@/components/ui/select"
import { Text as GluestackText } from "@/components/ui/text"

const CreatePost = ({ communities, onSubmit }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [loading, setLoading] = useState(false);
  const webviewRef = useRef(null);

  const handleTitleChange = (e) => setPostTitle(e.target.value);
  const handleCommunityChange = (value) => setSelectedCommunity(value);

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "chat-app");
    data.append("cloud_name", "piyushproj");

    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/piyushproj/image/upload",
      {
        method: "post",
        body: data,
      }
    );

    const uploadData = await uploadResponse.json();
    return uploadData.url; 
  };

  const handleImageSelection = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (result.assets && result.assets[0]) {
      const file = result.assets[0];
      const imageUrl = await handleImageUpload(file);
      setPostContent(prevContent => prevContent + `<img src="${imageUrl}" />`);
      webviewRef.current.injectJavaScript(`
        const quill = document.querySelector(".ql-editor");
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", "${imageUrl}");
      `);
    } else {
      Alert.alert("No image selected");
    }
  };

  const handleSubmit = () => {
    if (postTitle && postContent && selectedCommunity) {
      onSubmit({
        title: postTitle,
        content: postContent,
        community: selectedCommunity,
      });
      setPostTitle("");
      setPostContent("");
      setSelectedCommunity("");
    }
  };

  const handleEditorChange = (content) => {
    setPostContent(content);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box padding={6} borderWidth={1} borderRadius="lg" boxShadow="md" paddingBottom={20}>
        <FormControl id="community">
          <GluestackText>Select Community</GluestackText>
          <Select
            selectedValue={selectedCommunity}
            onValueChange={handleCommunityChange}
          >
            {communities.map((community) => (
              <SelectItem
                key={community.college_id}
                label={community.name}
                value={community.college_id}
              />
            ))}
          </Select>
        </FormControl>

        <FormControl id="title">
          <GluestackText>Post Title</GluestackText>
          <Input
            value={postTitle}
            onChangeText={setPostTitle}
            placeholder="Enter post title"
          />
        </FormControl>

        <FormControl id="post">
          <GluestackText>Create Post</GluestackText>
          <Box position="relative">
            <WebView
              ref={webviewRef}
              originWhitelist={['*']}
              source={{ html: '<div class="ql-editor" contenteditable="true"></div>' }}
              javaScriptEnabled={true}
              onMessage={(event) => handleEditorChange(event.nativeEvent.data)}
              injectedJavaScript={`
                var quill = new Quill(".ql-editor", {
                  theme: "snow",
                  modules: {
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                      ["link", "image"],
                      ["clean"]
                    ],
                  },
                });
                window.quill = quill;
                quill.on('text-change', function(delta, oldDelta, source) {
                  window.ReactNativeWebView.postMessage(quill.root.innerHTML);
                });
              `}
              style={{ height: 500, marginBottom: 20 }}
            />
            <Button 
              onPress={handleSubmit} 
              title={loading ? "Submitting..." : "Submit"} 
              disabled={loading}
            />
          </Box>
        </FormControl>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default CreatePost;
