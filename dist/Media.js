import React from "react";
import { Image, Pressable, StyleSheet, View, } from "react-native";
const Media = (MediaProps) => {
    var _a;
    const { item, index, themeColor, onPressItem, videoContainerStyle, videoIconStyle, videoIcon, renderVideoComponent, } = MediaProps;
    const { imageStyle, isVideoStyle, videoIconStyles } = styles;
    const isVideo = ((_a = item.node.type.split("/")) === null || _a === void 0 ? void 0 : _a[0]) === "video";
    const renderVideo = () => {
        if (!isVideo) {
            return null;
        }
        else {
            return (<>
          {(renderVideoComponent !== undefined && renderVideoComponent()) || (<View style={[isVideoStyle, videoContainerStyle]}>
                <Image source={videoIcon !== null && videoIcon !== void 0 ? videoIcon : require("./Images/video.png")} style={[videoIconStyles, videoIconStyle]}/>
              </View>) ||
                    null}
        </>);
        }
    };
    return (<Pressable style={styles.center} onPress={() => onPressItem(item)}>
      <Image source={{ uri: item.node.image.uri }} style={[
            imageStyle,
            {
                borderWidth: (index >= 0 && 1) || 0,
                borderColor: themeColor,
            },
        ]}/>
      {renderVideo()}
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
        padding: 5,
        borderRadius: 20,
        backgroundColor: "#ffffff90",
    },
    center: { justifyContent: "center", alignItems: "center" },
    videoIconStyles: { height: 20, width: 20 },
});
//# sourceMappingURL=Media.js.map