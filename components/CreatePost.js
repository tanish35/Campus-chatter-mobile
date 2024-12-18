import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Box } from "@/components/ui/box";
// import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { Text as GluestackText } from "@/components/ui/text";
import { IconComponent } from "@/components/ui/icon";

const CreatePost = ({ communities, onSubmit }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (postTitle && postContent && selectedCommunity) {
      setLoading(true);
      onSubmit({
        title: postTitle,
        content: postContent,
        community: selectedCommunity,
      });
      setPostTitle("");
      setPostContent("");
      setLoading(false);
    } else {
      Alert.alert("Please fill all fields before submitting.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box
        padding={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
        style={styles.box}
      >
        <FormControl id="community">
          <GluestackText>Select Community</GluestackText>
          <Select
            selectedValue={selectedCommunity}
            onValueChange={(value) => setSelectedCommunity(value)}
          >
            <SelectTrigger>
              <SelectInput
                placeholder="Select a community"
                style={styles.selectInput}
              />
              <SelectIcon as={IconComponent} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {communities.map((community) => (
                  <SelectItem
                    key={community.college_id}
                    label={community.name}
                    value={community.college_id}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </FormControl>

        <FormControl id="title" style={styles.formControl}>
          <GluestackText>Post Title</GluestackText>
          <TextInput
            value={postTitle}
            onChangeText={setPostTitle}
            placeholder="Enter post title"
            style={styles.input}
          />
        </FormControl>

        <FormControl id="content" style={styles.formControl}>
          <GluestackText>Post Content</GluestackText>
          <TextInput
            style={styles.textArea}
            value={postContent}
            onChangeText={setPostContent}
            placeholder="Write your post content here..."
            multiline
            numberOfLines={6}
          />
        </FormControl>

        <Button
          onPress={handleSubmit}
          title={loading ? "Submitting..." : "Submit"}
          disabled={loading}
        />
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formControl: {
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    textAlignVertical: "top",
    fontSize: 16,
    height: 150,
  },
  box: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    boxShadow: "lg",
    width: "90%",
    alignSelf: "center",
  },
  selectInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 200,
    maxWidth: "100%",
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default CreatePost;
