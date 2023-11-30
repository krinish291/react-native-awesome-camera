/* eslint-disable react-hooks/exhaustive-deps */
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
  Platform,
  StyleProp,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
} from "react-native";
import {
  Camera,
  CameraProps as VisionCameraProps,
  PhotoFile,
  Point,
  RecordVideoOptions as VisionRecordVideoOptions,
  TakePhotoOptions as VisionTakePhotoOptions,
  VideoFile,
  useCameraPermission,
  useMicrophonePermission,
  useCameraDevice,
} from "react-native-vision-camera";
import {
  CameraRoll,
  PhotoIdentifier,
  PhotoIdentifiersPage,
} from "@react-native-camera-roll/camera-roll";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import {
  getPhotoPermission,
  getStorageOrLibraryPermission,
  getVideoPermission,
} from "./Permissions";
import { Media } from "./Media";

const white = "white";
const yellow = "yellow";
const black = "black";

interface CameraProps
  extends Omit<
    VisionCameraProps,
    "device" | "isActive" | "photo" | "video" | "audio"
  > {
  isActive?: boolean;
}

type RecordVideoOptions = Pick<VisionRecordVideoOptions, "flash">;

type TakePhotoOptions = Omit<VisionTakePhotoOptions, "flash">;

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
    showGallery = true,
    photo = true,
    video = true,
    closeContainerStyle,
    closeIconStyle,
    closeIcon,
    renderCloseComponent,
    videoContainerStyle,
    videoIconStyle,
    videoIcon,
    renderVideoComponent,
    flashContainerStyle,
    flashIconStyle,
    flashIcon,
    renderFlashComponent,
    changeCameraContainerStyle,
    changeCameraIconStyle,
    changeCameraIcon,
    renderChangeCameraComponent,
  } = props;

  const {
    photoButton,
    bottomOuter,
    videoStyle,
    imageStyle,
    bottomInner,
    flashStyle,
    changeCamStyle,
    isVideoStyle,
    flexDirection,
    borderWidth,
    centerStyle,
    closeButtonStyle,
    focus,
  } = styles;

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTorch, setIsTorch] = useState<boolean>(false);
  const [hasStoragePermission, setHasStoragePermission] =
    useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoIdentifiersPage>();
  const [selectedImage, setSelectedImage] = useState<
    (PhotoFile | VideoFile | PhotoIdentifier)[]
  >([]);
  const [media, setMedia] = useState<(PhotoFile | VideoFile)[]>([]);
  const [focused, setFocused] = useState<Point>();
  const [frontCamera, setIsFrontCamera] = useState(false);
  const {
    hasPermission: hasCameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();
  const {
    hasPermission: hasMicrophonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  const getIsPhotos = () => {
    let isPhoto = true;
    if (photo && video) {
      isPhoto = true;
    } else if (video) {
      isPhoto = false;
    } else if (photo) {
      isPhoto = true;
    }
    return isPhoto;
  };

  const [isPhotos, setIsPhotos] = useState<boolean>(getIsPhotos());

  const backCameraDevice = useCameraDevice("back");
  const frontCameraDevice = useCameraDevice("front");
  const camera = useRef<Camera>(null);

  useEffect(() => {
    managePermissions();
    if (!hasCameraPermission) {
      requestCameraPermission();
    }
    if (!hasMicrophonePermission) {
      requestMicrophonePermission();
    }
  }, [hasCameraPermission, hasMicrophonePermission]);

  useEffect(() => {
    if (hasStoragePermission) {
      getPhotosDetails();
    }
  }, [hasStoragePermission]);

  const getPhotosDetails = async () => {
    if (showGallery) {
      const items = await CameraRoll.getPhotos({
        first: 20,
        assetType: (photo && video && "All") || (video && "Videos") || "Photos",
      });
      setPhotos(items);
    }
  };

  const managePermissions = async () => {
    try {
      if (showGallery) {
        const isStoragePermission = await getStorageOrLibraryPermission();
        let videoPermission = false;
        let photoPermission = false;
        if (Number(Platform.Version) >= 33) {
          photoPermission = await getPhotoPermission();
          videoPermission = await getVideoPermission();
        }
        setHasStoragePermission(
          isStoragePermission || (photoPermission && videoPermission)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMorePhotos = async () => {
    try {
      if (photos?.page_info.has_next_page && showGallery) {
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
      if (camera.current && photo) {
        const snapshot = await camera?.current.takePhoto({
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
      if (!video) {
        return;
      }
      if (!hasMicrophonePermission) {
        throw new Error("No Microphone Permission Found.");
      }

      if (camera.current) {
        setIsRecording(true);
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
    setIsRecording(false);
    if (camera.current && isRecording) {
      await camera.current.stopRecording();
    }
  };

  const onFocus = async (e: GestureResponderEvent) => {
    try {
      if (
        (!frontCamera && backCameraDevice?.supportsFocus) ||
        (frontCamera && frontCameraDevice?.supportsFocus)
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
    frontCameraDevice === undefined ||
    backCameraDevice === undefined ||
    !hasCameraPermission
  ) {
    return (
      <View style={centerStyle}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const identifyVideo = (obj: VideoFile) => {
    if (obj.duration) {
      return (
        <>
          {(renderVideoComponent !== undefined && renderVideoComponent()) || (
            <View style={[isVideoStyle, videoContainerStyle]}>
              <Image
                source={videoIcon ?? require("./Images/video.png")}
                style={[styles.flashIconStyle, videoIconStyle]}
              />
            </View>
          )}
        </>
      );
    } else {
      return null;
    }
  };

  const renderHeader = () => (
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
                  { borderColor: (isSelected && themeColor) || "transparent" },
                ]}
              />
              {identifyVideo(obj as VideoFile)}
            </Pressable>
          );
        })) ||
        null}
    </View>
  );

  const focusedView = () =>
    focused && <View style={[focus, { top: focused.y, left: focused.x }]} />;

  const renderItem = ({ item }: { item: PhotoIdentifier }) => {
    const selectedImages = selectedImage as PhotoIdentifier[];
    const index = selectedImages.indexOf(item);
    return (
      <Media
        index={index}
        item={item}
        onPressItem={onPressItem}
        themeColor={themeColor!}
        renderVideoComponent={renderVideoComponent}
        videoContainerStyle={videoContainerStyle}
        videoIcon={videoIcon}
        videoIconStyle={videoIconStyle}
      />
    );
  };

  const getBottomView = () => {
    return (
      <View style={styles.bottomViewContainer}>
        <Pressable
          onPress={() => setIsPhotos(false)}
          style={[
            styles.videoText,
            {
              backgroundColor: (isPhotos && "transparent") || themeColor,
            },
          ]}
        >
          <Text style={styles.blackColor}>{"Video"}</Text>
        </Pressable>
        <Pressable
          onPress={() => setIsPhotos(true)}
          style={[
            styles.photoText,
            {
              backgroundColor: (isPhotos && themeColor) || "transparent",
            },
          ]}
        >
          <Text style={styles.blackColor}>{"Photo"}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      {(hasCameraPermission && (
        <Camera
          {...cameraProps}
          ref={camera}
          onError={(error) => console.log(error)}
          style={[StyleSheet.absoluteFill, cameraProps?.style]}
          device={frontCamera ? frontCameraDevice : backCameraDevice}
          isActive
          photo={photo}
          video={video}
          focusable
          audio
          enableZoomGesture
        />
      )) ||
        null}

      {(photo && video && (
        <GestureHandlerRootView style={StyleSheet.absoluteFill}>
          <PanGestureHandler
            onGestureEvent={(e) => {
              if (isPhotos && e.nativeEvent.translationX > 0) {
                setIsPhotos(false);
              } else if (!isPhotos && e.nativeEvent.translationX < 0) {
                setIsPhotos(true);
              }
            }}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onTouchEnd={(e) =>
                (frontCameraDevice?.supportsFocus ||
                  backCameraDevice?.supportsFocus) &&
                onFocus(e)
              }
            />
          </PanGestureHandler>
        </GestureHandlerRootView>
      )) ||
        null}

      <Pressable
        style={[closeButtonStyle, closeContainerStyle]}
        onPress={() => setIsOpen(false)}
      >
        {(renderCloseComponent !== undefined && renderCloseComponent()) || (
          <Image
            source={closeIcon ?? require("./Images/close.png")}
            style={[styles.flashIconStyle, closeIconStyle]}
          />
        )}
      </Pressable>

      <View style={bottomOuter}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={photos?.edges}
          horizontal
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={getMorePhotos}
        />

        <CheckoutBtn
          selectedImage={selectedImage}
          themeColor={themeColor}
          onPressCheckout={checkOut}
          secondaryColor={secondaryColor}
        />

        <View style={bottomInner}>
          <Pressable
            onPress={() => setIsTorch((prev) => !prev)}
            disabled={frontCamera}
            style={[
              flashStyle,
              { backgroundColor: (isTorch && white) || "transparent" },
              flashContainerStyle,
            ]}
          >
            {(renderFlashComponent !== undefined && renderFlashComponent()) || (
              <Image
                source={flashIcon ?? require("./Images/flash.png")}
                style={[styles.flashIconStyle, flashIconStyle]}
              />
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              if (isPhotos) {
                takePicture();
              } else {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }
            }}
            style={photoButton}
          >
            <View style={isRecording && videoStyle} />
          </Pressable>

          <Pressable
            style={[changeCamStyle, changeCameraContainerStyle]}
            onPress={onPressChangeCamera}
          >
            {(renderChangeCameraComponent !== undefined &&
              renderChangeCameraComponent()) || (
              <Image
                source={changeCameraIcon ?? require("./Images/swap.png")}
                style={[styles.changeCameraIconStyle, changeCameraIconStyle]}
              />
            )}
          </Pressable>
        </View>

        <View>{(photo && video && getBottomView()) || null}</View>
      </View>

      {focusedView()}
    </>
  );
};

const CheckoutBtn = (props: {
  selectedImage: (PhotoFile | VideoFile | PhotoIdentifier)[];
  themeColor: string;
  secondaryColor: string;
  onPressCheckout: () => void;
}) => {
  const { selectedImage, themeColor, secondaryColor, onPressCheckout } = props;
  const { checkButtonStyle, selectedLength, tick } = styles;

  if (!selectedImage.length) {
    return null;
  }

  return (
    <Pressable
      style={[checkButtonStyle, { backgroundColor: themeColor }]}
      onPress={onPressCheckout}
    >
      <Text style={[{ color: secondaryColor }, selectedLength]}>
        {selectedImage.length}
      </Text>
      <Text style={[{ color: secondaryColor }, tick]}>{" ✓"}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  photoButton: {
    height: 80,
    width: 80,
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
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
  changeCamStyle: {
    height: 40,
    width: 40,
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
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#ffffff90",
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
  changeCameraIconStyle: {
    height: 20,
    width: 20,
    tintColor: "white",
  },
  flashIconStyle: {
    height: 20,
    width: 20,
  },
  blackColor: {
    color: "black",
  },
  bottomViewContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 5,
  },
  videoText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  photoText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    borderRadius: 15,
  },
});

export default AwesomeCamera;

