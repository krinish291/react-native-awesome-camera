import React from 'react';
import { StyleProp, ViewStyle, ImageStyle, ImageSourcePropType } from 'react-native';
import { CameraProps as VisionCameraProps, PhotoFile, RecordVideoOptions as VisionRecordVideoOptions, TakePhotoOptions as VisionTakePhotoOptions, VideoFile } from 'react-native-vision-camera';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
interface CameraProps extends Omit<VisionCameraProps, 'device' | 'isActive' | 'photo' | 'video' | 'audio'> {
    isActive?: boolean;
}
type RecordVideoOptions = Pick<VisionRecordVideoOptions, 'flash'>;
type TakePhotoOptions = Omit<VisionTakePhotoOptions, 'flash'>;
interface AwesomeCameraProps {
    setIsOpen: Function;
    getData: (data: (PhotoIdentifier | PhotoFile | VideoFile)[]) => void;
    themeColor?: string;
    secondaryColor?: string;
    cameraProps?: CameraProps;
    multiSelect?: boolean;
    takePhotoOptions?: TakePhotoOptions;
    recordVideoOptions?: RecordVideoOptions;
    showGallery?: boolean;
    photo?: boolean;
    video?: boolean;
    closeContainerStyle?: StyleProp<ViewStyle>;
    closeIconStyle?: StyleProp<ImageStyle>;
    closeIcon?: ImageSourcePropType;
    renderCloseComponent?: () => React.ReactComponentElement<any>;
    videoContainerStyle?: StyleProp<ViewStyle>;
    videoIconStyle?: StyleProp<ImageStyle>;
    videoIcon?: ImageSourcePropType;
    renderVideoComponent?: () => React.ReactComponentElement<any>;
    flashContainerStyle?: StyleProp<ViewStyle>;
    flashIconStyle?: StyleProp<ImageStyle>;
    flashIcon?: ImageSourcePropType;
    renderFlashComponent?: () => React.ReactComponentElement<any>;
    changeCameraContainerStyle?: StyleProp<ViewStyle>;
    changeCameraIconStyle?: StyleProp<ImageStyle>;
    changeCameraIcon?: ImageSourcePropType;
    renderChangeCameraComponent?: () => React.ReactComponentElement<any>;
}
declare const AwesomeCamera: (props: AwesomeCameraProps) => JSX.Element;
export default AwesomeCamera;
