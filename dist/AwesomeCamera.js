var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, FlatList, Text, Image, } from "react-native";
import { Camera, useCameraDevices, } from "react-native-vision-camera";
import CameraRoll from "@react-native-community/cameraroll";
import { getCameraPermission, getStorageOrLibraryPermission, } from "./Permissions";
const AwesomeCamera = (props) => {
    const { setIsOpen, getData, zoom, themeColor = "yellow" } = props;
    const { photoButton, bottomOuter, videoStyle, imageStyle, bottomInner, bottomText, flashTextStyle, fontSize, flashStyle, checkButtonStyle, isVideoStyle, flexDirection, borderWidth, centerStyle, closeButtonStyle, } = styles;
    const [video, setVideo] = useState(false);
    const [isTorch, setIsTorch] = useState(false);
    const [hasStoragePermission, setHasStoragePermission] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [photos, setPhotos] = useState();
    const [selectedImage, setSelectedImage] = useState([]);
    // eslint-disable-next-line no-spaced-func
    const [media, setMedia] = useState([]);
    const devices = useCameraDevices();
    const camera = useRef(null);
    const [frontCamera, setIsFrontCamera] = useState(false);
    useEffect(() => {
        managePermissions();
    }, []);
    useEffect(() => {
        if (hasStoragePermission) {
            getPhotosDetails();
        }
    }, [hasStoragePermission]);
    const getPhotosDetails = () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield CameraRoll.getPhotos({
            first: 20,
            assetType: "All",
        });
        setPhotos(items);
    });
    const managePermissions = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isCameraPermission = yield getCameraPermission();
            if (isCameraPermission) {
                setHasCameraPermission(true);
            }
            const isStoragePermission = yield getStorageOrLibraryPermission();
            if (isStoragePermission) {
                setHasStoragePermission(true);
            }
            const microphonePermission = yield Camera.getMicrophonePermissionStatus();
            if (microphonePermission === "denied") {
                yield Camera.requestMicrophonePermission();
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const getMorePhotos = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (photos === null || photos === void 0 ? void 0 : photos.page_info.has_next_page) {
                const items = yield CameraRoll.getPhotos({
                    first: 20,
                    assetType: "All",
                    after: photos === null || photos === void 0 ? void 0 : photos.page_info.end_cursor,
                });
                setPhotos({
                    edges: [...photos === null || photos === void 0 ? void 0 : photos.edges, ...items.edges],
                    page_info: items.page_info,
                });
            }
        }
        catch (error) { }
    });
    const takePicture = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (camera.current) {
                const snapshot = yield (camera === null || camera === void 0 ? void 0 : camera.current.takeSnapshot({
                    quality: 85,
                    skipMetadata: true,
                }));
                snapshot.path = `file:///${snapshot.path}`;
                setMedia([snapshot, ...media]);
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    const startRecording = () => {
        try {
            setVideo(true);
            if (camera.current) {
                camera.current.startRecording({
                    flash: "off",
                    onRecordingFinished: (v) => {
                        setMedia([v, ...media]);
                    },
                    onRecordingError: (error) => console.error(error),
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    const checkOut = () => {
        const data = [...media, ...selectedImage];
        getData(data);
        setIsOpen(false);
    };
    const stopRecording = () => __awaiter(void 0, void 0, void 0, function* () {
        setVideo(false);
        if (camera.current && video) {
            yield camera.current.stopRecording();
        }
    });
    if ((frontCamera && devices.front == null) ||
        (!frontCamera && devices.back == null) ||
        !hasCameraPermission) {
        return (<View style={centerStyle}>
        <ActivityIndicator size={"large"}/>
      </View>);
    }
    const renderHeader = () => {
        return (<View style={flexDirection}>
        {(media.length &&
                media.map((obj, index) => {
                    return (<Pressable key={index} onPress={() => {
                            media.splice(index, 1);
                            setMedia([...media]);
                        }}>
                <Image onError={(e) => {
                            console.log(e);
                        }} source={{
                            uri: `${obj.path}`,
                        }} style={[imageStyle, borderWidth, { borderColor: themeColor }]}/>
                {((obj === null || obj === void 0 ? void 0 : obj.duration) && <Text style={isVideoStyle}>{"▶️"}</Text>) ||
                            null}
              </Pressable>);
                })) ||
                null}
      </View>);
    };
    const Media = (MediaProps) => {
        var _a;
        const { item, index } = MediaProps;
        const isVideo = ((_a = item.node.type.split("/")) === null || _a === void 0 ? void 0 : _a[0]) === "video";
        return (<Pressable onPress={() => {
                if (index >= 0) {
                    selectedImage.splice(index, 1);
                    setSelectedImage([...selectedImage]);
                }
                else {
                    setSelectedImage([...selectedImage, item]);
                }
            }}>
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
    return (<>
      <Camera ref={camera} onError={(error) => console.log(error)} style={StyleSheet.absoluteFill} device={frontCamera ? devices.front : devices.back} isActive={true} video={true} focusable={true} audio={true} zoom={zoom} torch={isTorch ? "on" : "off"} enableZoomGesture={true}/>
      <Pressable style={closeButtonStyle} onPress={() => {
            setIsOpen(false);
        }}>
        <Text style={fontSize}>{"❌"}</Text>
      </Pressable>
      <View style={bottomOuter}>
        <FlatList showsHorizontalScrollIndicator={false} data={photos === null || photos === void 0 ? void 0 : photos.edges} horizontal={true} ListHeaderComponent={renderHeader} renderItem={({ item }) => {
            const index = selectedImage.findIndex((data) => data.node.image.uri === item.node.image.uri);
            return <Media index={index} item={item}/>;
        }} keyExtractor={(item) => item.node.image.uri} onEndReached={getMorePhotos}/>
        {((media.length || selectedImage.length) && (<Pressable style={[checkButtonStyle, { backgroundColor: themeColor }]} onPress={checkOut}>
            <Text>{`${media.length + selectedImage.length} ✔️`}</Text>
          </Pressable>)) ||
            null}
        <View style={bottomInner}>
          <Pressable onPress={() => {
            setIsTorch(!isTorch);
        }} disabled={frontCamera} style={[
            flashStyle,
            { backgroundColor: (isTorch && "white") || "transparent" },
        ]}>
            <Text style={[flashTextStyle, fontSize]}>{"⚡"}</Text>
          </Pressable>
          <Pressable onPress={takePicture} style={photoButton} onLongPress={startRecording} onPressOut={stopRecording}>
            <View style={(video && videoStyle) || {}}/>
          </Pressable>
          <Pressable onPress={() => {
            setIsFrontCamera(!frontCamera);
            setIsTorch(false);
        }}>
            <Text style={fontSize}>{"🔄"}</Text>
          </Pressable>
        </View>
        <Text style={bottomText}>{"Hold for video,tap for photo "}</Text>
      </View>
    </>);
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
        borderColor: "white",
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 1,
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
    closeButtonStyle: {
        top: 50,
        position: "absolute",
        left: 50,
    },
});
export default AwesomeCamera;
//# sourceMappingURL=AwesomeCamera.js.map