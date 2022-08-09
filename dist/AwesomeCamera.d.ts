/// <reference types="react" />
import { CameraDevice, CameraProps as VisionCameraProps, PhotoFile, RecordVideoOptions as VisionRecordVideoOptions, TakePhotoOptions as VisionTakePhotoOptions, VideoFile } from "react-native-vision-camera";
import CameraRoll from "@react-native-community/cameraroll";
interface CameraProps extends Omit<VisionCameraProps, "device" | "isActive"> {
    device?: CameraDevice;
    isActive?: boolean;
}
declare type RecordVideoOptions = Pick<VisionRecordVideoOptions, "flash">;
declare type TakePhotoOptions = Omit<VisionTakePhotoOptions, "flash">;
interface AwesomeCameraProps {
    setIsOpen: Function;
    getData: (data: (CameraRoll.PhotoIdentifier | PhotoFile | VideoFile)[]) => void;
    themeColor?: string;
    secondaryColor?: string;
    cameraProps?: CameraProps;
    multiSelect?: boolean;
    takePhotoOptions?: TakePhotoOptions;
    recordVideoOptions?: RecordVideoOptions;
}
declare const AwesomeCamera: (props: AwesomeCameraProps) => JSX.Element;
export default AwesomeCamera;
