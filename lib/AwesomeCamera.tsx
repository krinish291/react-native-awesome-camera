import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  GestureResponderEvent,
} from "react-native";
import {
  Camera,
  CameraDevice,
  CameraProps as VisionCameraProps,
  PhotoFile,
  Point,
  RecordVideoOptions as VisionRecordVideoOptions,
  TakePhotoOptions as VisionTakePhotoOptions,
  useCameraDevices,
  VideoFile,
} from "react-native-vision-camera";
import CameraRoll, {
  PhotoIdentifier,
  PhotoIdentifiersPage,
} from "@react-native-community/cameraroll";
import {
  getCameraPermission,
  getMicrophonePermission,
  getStorageOrLibraryPermission,
} from "./Permissions";
import { Media } from "./Media";

const white = "white";
const yellow = "yellow";
const black = "black";

interface CameraProps extends Omit<VisionCameraProps, "device" | "isActive"> {
  device?: CameraDevice;
  isActive?: boolean;
}

type RecordVideoOptions = Pick<VisionRecordVideoOptions, "flash">;

type TakePhotoOptions = Omit<VisionTakePhotoOptions, "flash">;

interface AwesomeCameraProps {
  setIsOpen: Function;
  getData: (
    data: (CameraRoll.PhotoIdentifier | PhotoFile | VideoFile)[]
  ) => void;
  themeColor?: string;
  secondaryColor?: string;
  cameraProps?: CameraProps;
  multiSelect?: boolean;
  takePhotoOptions?: TakePhotoOptions;
  recordVideoOptions?: RecordVideoOptions;
}

const AwesomeCamera = (props: AwesomeCameraProps) => {
  const {
    setIsOpen,
    getData,
    cameraProps,
    themeColor = yellow,
    secondaryColor = black,
    multiSelect = true,
    takePhotoOptions,
    recordVideoOptions,
  } = props;
  const {
    photoButton,
    bottomOuter,
    videoStyle,
    imageStyle,
    bottomInner,
    bottomText,
    flashTextStyle,
    fontSize,
    flashStyle,
    checkButtonStyle,
    isVideoStyle,
    flexDirection,
    borderWidth,
    centerStyle,
    closeButtonStyle,
    focus,
  } = styles;

  const [video, setVideo] = useState<boolean>(false);
  const [isTorch, setIsTorch] = useState<boolean>(false);
  const [hasStoragePermission, setHasStoragePermission] =
    useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] =
    useState<boolean>(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] =
    useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoIdentifiersPage>();
  // eslint-disable-next-line no-spaced-func
  const [selectedImage, setSelectedImage] = useState<
    (PhotoFile | VideoFile | PhotoIdentifier)[]
  >([]);
  const [media, setMedia] = useState<(PhotoFile | VideoFile)[]>([]);
  const [focused, setFocused] = useState<Point>();
  const [frontCamera, setIsFrontCamera] = useState(false);

  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);

  useEffect(() => {
    managePermissions();
  }, []);

  useEffect(() => {
    if (hasStoragePermission) {
      getPhotosDetails();
    }
  }, [hasStoragePermission]);

  const getPhotosDetails = async () => {
    const items = await CameraRoll.getPhotos({
      first: 20,
      assetType: "All",
    });
    setPhotos(items);
  };

  const managePermissions = async () => {
    try {
      const isCameraPermission = await getCameraPermission();
      setHasCameraPermission(isCameraPermission);

      const isStoragePermission = await getStorageOrLibraryPermission();
      setHasStoragePermission(isStoragePermission);

      const isMicPermission = await getMicrophonePermission();
      setHasMicrophonePermission(isMicPermission);
    } catch (error) {
      console.log(error);
    }
  };

  const getMorePhotos = async () => {
    try {
      if (photos?.page_info.has_next_page) {
        const items = await CameraRoll.getPhotos({
          first: 20,
          assetType: "All",
          after: photos?.page_info.end_cursor,
        });
        setPhotos({
          edges: [...photos?.edges, ...items.edges],
          page_info: items.page_info,
        });
      }
    } catch (error) {}
  };

  const takePicture = async () => {
    try {
      if (camera.current) {
        const snapshot = await camera?.current.takePhoto({
          skipMetadata: true,
          ...takePhotoOptions,
          flash: (isTorch && "on") || "off",
        });
        snapshot.path = `file:///${snapshot.path}`;
        const newMedia = [snapshot, ...media];
        setMedia(newMedia);

        if (!multiSelect) {
          setSelectedImage([snapshot]);
        } else {
          setSelectedImage([...selectedImage, snapshot]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const startRecording = () => {
    try {
      if (!hasMicrophonePermission) {
        throw new Error("No Microphone Permission Found.");
      }
      setVideo(true);
      if (camera.current) {
        camera.current.startRecording({
          ...recordVideoOptions,
          flash: (isTorch && "on") || "off",
          onRecordingFinished: (v: VideoFile) => {
            const newMedia = [v, ...media];
            setMedia(newMedia);
            if (!multiSelect) {
              setSelectedImage([v]);
            } else {
              setSelectedImage([...selectedImage, v]);
            }
          },
          onRecordingError: (error) => console.error(error),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkOut = () => {
    getData(selectedImage);
    setIsOpen(false);
  };

  const stopRecording = async () => {
    setVideo(false);
    if (camera.current && video) {
      await camera.current.stopRecording();
    }
  };

  const onFocus = async (e: GestureResponderEvent) => {
    try {
      if (
        (!frontCamera && devices?.back?.supportsFocus) ||
        (frontCamera && devices?.front?.supportsFocus)
      ) {
        e.persist();
        const event = e.nativeEvent;
        let point: Point = {
          x: Math.round(event.pageX - 25),
          y: Math.round(event.pageY - 25),
        };
        setFocused({ x: point.x - 25, y: point.y - 25 });
        await camera?.current?.focus(point);
      }
    } catch (error: any) {
      console.log(e);
    } finally {
      setFocused(undefined);
    }
  };

  const onPressItem = (obj: PhotoFile | VideoFile | PhotoIdentifier) => {
    if (multiSelect) {
      let selected = [...selectedImage];
      const index = selected.indexOf(obj);
      (index === -1 && selected.push(obj)) || selected.splice(index, 1);
      setSelectedImage(selected);
    } else {
      setSelectedImage([obj]);
    }
  };

  const onPressChangeCamera = () => {
    setIsFrontCamera(!frontCamera);
    setIsTorch(false);
  };

  if (
    (frontCamera && devices.front == null) ||
    (!frontCamera && devices.back == null) ||
    !hasCameraPermission
  ) {
    return (
      <View style={centerStyle}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const identifyVideo = (obj: VideoFile) =>
    (obj.duration && <Text style={isVideoStyle}>{"▶️"}</Text>) || null;

  const renderHeader = () => {
    return (
      <View style={flexDirection}>
        {(media.length &&
          media.map((obj: PhotoFile | VideoFile, index: number) => {
            const isSelected = selectedImage.includes(obj);
            return (
              <Pressable
                style={styles.center}
                key={index}
                onPress={() => onPressItem(obj)}
              >
                <Image
                  onError={(e) => console.log(e)}
                  source={{ uri: `${obj.path}` }}
                  style={[
                    imageStyle,
                    borderWidth,
                    {
                      borderColor: (isSelected && themeColor) || "transparent",
                    },
                  ]}
                />
                {identifyVideo(obj as VideoFile)}
              </Pressable>
            );
          })) ||
          null}
      </View>
    );
  };

  const focusedView = () =>
    focused && <View style={[focus, { top: focused.y, left: focused.x }]} />;

  return (
    <>
      <Camera
        {...cameraProps}
        ref={camera}
        onError={(error) => console.log(error)}
        style={StyleSheet.absoluteFill}
        device={frontCamera ? devices.front! : devices.back!}
        onTouchEnd={(e) => devices?.back?.supportsFocus && onFocus(e)}
        isActive
        photo
        video
        focusable
        audio
        enableZoomGesture
      />
      <Pressable
        style={closeButtonStyle}
        onPress={() => {
          setIsOpen(false);
        }}
      >
        <Text style={fontSize}>{"❌"}</Text>
      </Pressable>
      <View style={bottomOuter}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={photos?.edges}
          horizontal
          ListHeaderComponent={renderHeader}
          renderItem={({ item }: { item: PhotoIdentifier }) => {
            const selectedImages = selectedImage as PhotoIdentifier[];
            const index = selectedImages.indexOf(item);
            return (
              <Media
                index={index}
                item={item}
                onPressItem={onPressItem}
                themeColor={themeColor!}
              />
            );
          }}
          keyExtractor={(item) => item.node.image.uri}
          onEndReached={getMorePhotos}
        />
        {(selectedImage.length && (
          <Pressable
            style={[checkButtonStyle, { backgroundColor: themeColor }]}
            onPress={checkOut}
          >
            <Text style={[{ color: secondaryColor }, styles.selectedLength]}>
              {selectedImage.length}
            </Text>
            <Text style={[{ color: secondaryColor }, styles.tick]}>{" ✓"}</Text>
          </Pressable>
        )) ||
          null}
        <View style={bottomInner}>
          <Pressable
            onPress={() => setIsTorch((prev) => !prev)}
            disabled={frontCamera}
            style={[
              flashStyle,
              { backgroundColor: (isTorch && white) || "transparent" },
            ]}
          >
            <Text style={[flashTextStyle, fontSize]}>{"⚡"}</Text>
          </Pressable>
          <Pressable
            onPress={takePicture}
            style={photoButton}
            onLongPress={startRecording}
            onPressOut={stopRecording}
          >
            <View style={(video && videoStyle) || {}} />
          </Pressable>
          <Pressable onPress={onPressChangeCamera}>
            <Text style={fontSize}>{"🔄"}</Text>
          </Pressable>
        </View>
        <Text style={bottomText}>{"Hold for video, tap for photo"}</Text>
      </View>
      {focusedView()}
    </>
  );
};

const styles = StyleSheet.create({
  photoButton: {
    height: 80,
    width: 80,
    marginTop: 10,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 40,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  videoStyle: {
    backgroundColor: "red",
    height: 60,
    width: 60,
    alignSelf: "center",
    borderRadius: 30,
  },
  bottomOuter: {
    position: "absolute",
    width: "100%",
    bottom: 10,
  },
  imageStyle: {
    height: 80,
    width: 80,
    margin: 2,
  },
  bottomInner: {
    flex: 1,
    marginBottom: 7,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomText: {
    textAlign: "center",
    color: "#fff",
  },
  flashTextStyle: {
    textAlign: "center",
  },
  fontSize: {
    fontSize: 25,
  },
  flashStyle: {
    borderColor: white,
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkButtonStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    top: -20,
    flexDirection: "row",
  },
  isVideoStyle: {
    position: "absolute",
    alignSelf: "center",
    // top: 20,
    fontSize: 25,
  },
  flexDirection: { flexDirection: "row" },
  borderWidth: { borderWidth: 1 },
  centerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonStyle: {
    top: 50,
    position: "absolute",
    left: 50,
  },
  focus: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: white,
  },
  center: { justifyContent: "center", alignItems: "center" },
  tick: {
    fontSize: 20,
  },
  selectedLength: {
    fontSize: 17,
  },
});

export default AwesomeCamera;
