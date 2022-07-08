import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
} from "react-native";
import {
  Camera,
  PhotoFile,
  useCameraDevices,
  VideoFile,
} from "react-native-vision-camera";
import CameraRoll, {
  PhotoIdentifier,
  PhotoIdentifiersPage,
} from "@react-native-community/cameraroll";
import {
  getCameraPermission,
  getStorageOrLibraryPermission,
} from "./Permissions";

const AwesomeCamera = () => {
  const {
    container,
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
  } = styles;
  const [video, setVideo] = useState<boolean>(false);
  const [isTorch, setIsTorch] = useState<boolean>(false);
  const [hasStoragePermission, setHasStoragePermission] =
    useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] =
    useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoIdentifiersPage>();
  const [selectedImage, setSelectedImage] = useState<PhotoIdentifier[]>([]);
  // eslint-disable-next-line no-spaced-func
  const [media, setMedia] = useState<(PhotoFile | VideoFile)[]>([]);
  const devices: any = useCameraDevices();
  const camera = useRef<Camera>(null);
  const [frontCamera, setIsFrontCamera] = useState(false);

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
      if (isCameraPermission) {
        setHasCameraPermission(true);
      }
      const isStoragePermission = await getStorageOrLibraryPermission();
      if (isStoragePermission) {
        setHasStoragePermission(true);
      }
      console.log({ isStoragePermission });

      const microphonePermission = await Camera.getMicrophonePermissionStatus();
      if (microphonePermission === "denied") {
        await Camera.requestMicrophonePermission();
      }
    } catch (error) {}
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
        const snapshot = await camera?.current.takeSnapshot({
          quality: 85,
          skipMetadata: true,
        });
        snapshot.path = `file:///${snapshot.path}`;
        setMedia([snapshot, ...media]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const startRecording = () => {
    try {
      setVideo(true);
      if (camera.current) {
        camera.current.startRecording({
          flash: "off",
          onRecordingFinished: (v: VideoFile) => {
            setMedia([v, ...media]);
          },
          onRecordingError: (error) => console.error(error),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = async () => {
    setVideo(false);
    if (camera.current && video) {
      await camera.current.stopRecording();
    }
  };

  if (
    (frontCamera && devices.front == null) ||
    (!frontCamera && devices.back == null) ||
    !hasCameraPermission
  ) {
    return (
      <View style={centerStyle}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  const renderHeader = () => {
    return (
      <View style={flexDirection}>
        {(media.length &&
          media.map((obj: any, index: number) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  media.splice(index!, 1);
                  setMedia([...media]);
                }}
              >
                <Image
                  onError={(e) => {
                    console.log(e);
                  }}
                  source={{
                    uri: `${obj.path}`,
                  }}
                  style={[imageStyle, borderWidth]}
                />
                {(obj?.duration && <Text style={isVideoStyle}>{"▶️"}</Text>) ||
                  null}
              </Pressable>
            );
          })) ||
          null}
      </View>
    );
  };

  interface MediaProps {
    index?: number;
    item: PhotoIdentifier;
  }

  const Media = (props: MediaProps) => {
    const { item, index } = props;
    const isVideo = item.node.type.split("/")?.[0] === "video";
    return (
      <Pressable
        onPress={() => {
          if (index! >= 0) {
            selectedImage.splice(index!, 1);
            setSelectedImage([...selectedImage]);
          } else {
            setSelectedImage([...selectedImage, item]);
          }
        }}
      >
        <Image
          source={{ uri: item.node.image.uri }}
          style={[
            imageStyle,
            {
              borderWidth: (index! >= 0 && 1) || 0,
            },
          ]}
        />
        {(isVideo && <Text style={isVideoStyle}>{"▶️"}</Text>) || null}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={container}>
      <Camera
        ref={camera}
        onError={(error) => console.log(error)}
        style={StyleSheet.absoluteFill}
        device={frontCamera ? devices.front : devices.back}
        isActive={true}
        video={true}
        focusable={true}
        audio={true}
        zoom={1}
        torch={isTorch ? "on" : "off"}
        enableZoomGesture={true}
      />
      <View style={bottomOuter}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={photos?.edges}
          horizontal={true}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }: { item: PhotoIdentifier }) => {
            const index = selectedImage.findIndex(
              (data) => data.node.image.uri === item.node.image.uri
            );
            return <Media index={index} item={item} />;
          }}
          keyExtractor={(item) => item.node.image.uri}
          onEndReached={getMorePhotos}
        />
        {((media.length || selectedImage.length) && (
          <Pressable style={checkButtonStyle}>
            <Text>{`${media.length + selectedImage.length} ✔️`}</Text>
          </Pressable>
        )) ||
          null}
        <View style={bottomInner}>
          <Pressable
            onPress={() => {
              setIsTorch(!isTorch);
            }}
            disabled={frontCamera}
            style={[
              flashStyle,
              { backgroundColor: (isTorch && "white") || "transparent" },
            ]}
          >
            <Text style={[flashTextStyle, fontSize]}>{"⚡"}</Text>
          </Pressable>
          <Pressable
            onPress={takePicture}
            style={photoButton}
            onLongPress={startRecording}
            onPressIn={() => {
              console.log("in");
            }}
            onPressOut={stopRecording}
          >
            <View style={(video && videoStyle) || {}} />
          </Pressable>
          <Pressable
            onPress={() => {
              setIsFrontCamera(!frontCamera);
              setIsTorch(false);
            }}
          >
            <Text style={fontSize}>{"🔄"}</Text>
          </Pressable>
        </View>
        <Text style={bottomText}>{"Hold for video,tap for photo "}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    borderColor: "yellow",
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
    borderColor: "white",
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  checkButtonStyle: {
    width: 50,
    height: 50,
    backgroundColor: "yellow",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    top: -20,
  },
  isVideoStyle: {
    position: "absolute",
    alignSelf: "center",
    top: 20,
    fontSize: 25,
  },
  flexDirection: { flexDirection: "row" },
  borderWidth: { borderWidth: 1 },
  centerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AwesomeCamera;
