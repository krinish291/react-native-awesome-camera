import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
const Media = (MediaProps) => {
    var _a;
    const { item, index, themeColor, onPressItem } = MediaProps;
    const { imageStyle, isVideoStyle } = styles;
    const isVideo = ((_a = item.node.type.split("/")) === null || _a === void 0 ? void 0 : _a[0]) === "video";
    return (<Pressable style={styles.center} onPress={() => onPressItem(item)}>
      <Image source={{ uri: item.node.image.uri }} style={[
            imageStyle,
            {
                borderWidth: (index >= 0 && 1) || 0,
                borderColor: themeColor,
            },
        ]}/>
      {(isVideo && <Text style={isVideoStyle}>{"▶️"}</Text>) || null}
    </Pressable>);
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
//# sourceMappingURL=Media.js.map