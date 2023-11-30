import React from "react";
import { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from "react-native";
import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import { PhotoFile, VideoFile } from "react-native-vision-camera";
interface MediaProps {
    index?: number;
    item: PhotoIdentifier;
    themeColor: string;
    onPressItem: (obj: PhotoFile | VideoFile | PhotoIdentifier) => void;
    videoContainerStyle?: StyleProp<ViewStyle>;
    videoIconStyle?: StyleProp<ImageStyle>;
    videoIcon?: ImageSourcePropType;
    renderVideoComponent?: () => React.ReactComponentElement<any>;
}
declare const Media: (MediaProps: MediaProps) => JSX.Element;
export { Media };
