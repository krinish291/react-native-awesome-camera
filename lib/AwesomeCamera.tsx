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
    selectedImageStyleOuter,
    selectedImageStyle,
    bottomInner,
    count,
  } = styles;
  const [video, setVideo] = useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoIdentifiersPage>();
  const [selectedImage, setSelectedImage] = useState<PhotoIdentifier[]>([]);
  // eslint-disable-next-line no-spaced-func
  const [media, setMedia] = useState<(PhotoFile | VideoFile)[]>([]);
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);

  let device = devices.back;

  useEffect(() => {
    managePermissions();
    getPhotosDetails();
  }, []);

  const getPhotosDetails = async () => {
    const items = await CameraRoll.getPhotos({
      first: 20,
      assetType: "Photos",
    });
    setPhotos(items);
  };

  const managePermissions = async () => {
    try {
      await getCameraPermission();
      await getStorageOrLibraryPermission();
      const microphonePermission = await Camera.getMicrophonePermissionStatus();
      if (microphonePermission === "denied") {
        await Camera.requestMicrophonePermission();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getMorePhotos = async () => {
    try {
      if (photos?.page_info.has_next_page) {
        const items = await CameraRoll.getPhotos({
          first: 20,
          assetType: "Photos",
          after: photos?.page_info.end_cursor,
        });
        setPhotos({
          edges: [...photos?.edges, ...items.edges],
          page_info: items.page_info,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const takePicture = async () => {
    try {
      if (camera.current) {
        const snapshot = await camera?.current.takeSnapshot({
          quality: 85,
          skipMetadata: true,
        });
        snapshot.path = `file:///${snapshot.path}`;
        setMedia([...media, snapshot]);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const startRecording = () => {
    try {
      setVideo(true);
      if (camera.current) {
        camera.current.startRecording({
          flash: "off",
          onRecordingFinished: (v: VideoFile) => {
            setMedia([...media, v]);
          },
          onRecordingError: (error: any) => console.error(error),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = async () => {
    setVideo(false);
    if (camera.current) {
      await camera.current.stopRecording();
    }
  };

  if (device == null) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={container}>
      <Camera
        ref={camera}
        onError={(error) => console.log(error)}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
        audio={true}
        focusable={true}
        enableZoomGesture={true}
      />
      <View style={bottomOuter}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={photos?.edges}
          horizontal={true}
          renderItem={({ item }: { item: PhotoIdentifier }) => {
            const index = selectedImage.findIndex(
              (data: any) => data.node.image.uri === item.node.image.uri
            );
            return (
              <Pressable
                onPress={() => {
                  if (index >= 0) {
                    selectedImage.splice(index, 1);
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
                      borderWidth: (index >= 0 && 1) || 0,
                    },
                  ]}
                />
              </Pressable>
            );
          }}
          keyExtractor={(item: any) => item.node.image.uri}
          onEndReached={getMorePhotos}
        />
        <View style={bottomInner}>
          <Text style={count}>{media.length + selectedImage.length}</Text>
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
          <View style={selectedImageStyleOuter}>
            {(media.length && (
              <Image
                onError={(e: any) => {
                  console.log(e);
                }}
                source={{
                  uri: `${media[media?.length - 1]?.path}`,
                }}
                style={selectedImageStyle}
              />
            )) ||
              null}
          </View>
        </View>
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
    bottom: 30,
  },
  imageStyle: {
    height: 100,
    width: 100,
    margin: 10,
    borderColor: "yellow",
  },
  count: {
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  bottomInner: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  selectedImageStyle: {
    width: 80,
    height: 80,
  },
  selectedImageStyleOuter: {
    flex: 1,
    alignItems: "center",
  },
});

export default AwesomeCamera;
