/// <reference types="react" />
import { PhotoIdentifier } from "@react-native-community/cameraroll";
import { PhotoFile, VideoFile } from "react-native-vision-camera";
interface MediaProps {
    index?: number;
    item: PhotoIdentifier;
    themeColor: string;
    onPressItem: (obj: PhotoFile | VideoFile | PhotoIdentifier) => void;
}
declare const Media: (MediaProps: MediaProps) => JSX.Element;
export { Media };
