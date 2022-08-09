import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { PhotoIdentifier } from "@react-native-community/cameraroll";
import { PhotoFile, VideoFile } from "react-native-vision-camera";

interface MediaProps {
  index?: number;
  item: PhotoIdentifier;
  themeColor: string;
  onPressItem: (obj: PhotoFile | VideoFile | PhotoIdentifier) => void;
}

const Media = (MediaProps: MediaProps) => {
  const { item, index, themeColor, onPressItem } = MediaProps;
  const { imageStyle, isVideoStyle } = styles;
  const isVideo = item.node.type.split("/")?.[0] === "video";
  return (
    <Pressable style={styles.center} onPress={() => onPressItem(item)}>
      <Image
        source={{ uri: item.node.image.uri }}
        style={[
          imageStyle,
          {
            borderWidth: (index! >= 0 && 1) || 0,
            borderColor: themeColor,
          },
        ]}
      />
      {(isVideo && <Text style={isVideoStyle}>{"▶️"}</Text>) || null}
    </Pressable>
  );
};

export { Media };

const styles = StyleSheet.create({
  imageStyle: {
    height: 80,
    width: 80,
    margin: 2,
  },
  isVideoStyle: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 25,
  },
  center: { justifyContent: "center", alignItems: "center" },
});
