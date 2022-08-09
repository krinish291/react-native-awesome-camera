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
import { getCameraPermission, getMicrophonePermission, getStorageOrLibraryPermission, } from "./Permissions";
import { Media } from "./Media";
const white = "white";
const yellow = "yellow";
const black = "black";
const AwesomeCamera = (props) => {
    const { setIsOpen, getData, cameraProps, themeColor = yellow, secondaryColor = black, multiSelect = true, takePhotoOptions, recordVideoOptions, } = props;
    const { photoButton, bottomOuter, videoStyle, imageStyle, bottomInner, bottomText, flashTextStyle, fontSize, flashStyle, checkButtonStyle, isVideoStyle, flexDirection, borderWidth, centerStyle, closeButtonStyle, focus, } = styles;
    const [video, setVideo] = useState(false);
    const [isTorch, setIsTorch] = useState(false);
    const [hasStoragePermission, setHasStoragePermission] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
    const [photos, setPhotos] = useState();
    // eslint-disable-next-line no-spaced-func
    const [selectedImage, setSelectedImage] = useState([]);
    const [media, setMedia] = useState([]);
    const [focused, setFocused] = useState();
    const [frontCamera, setIsFrontCamera] = useState(false);
    const devices = useCameraDevices();
    const camera = useRef(null);
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
            setHasCameraPermission(isCameraPermission);
            const isStoragePermission = yield getStorageOrLibraryPermission();
            setHasStoragePermission(isStoragePermission);
            const isMicPermission = yield getMicrophonePermission();
            setHasMicrophonePermission(isMicPermission);
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
                const snapshot = yield (camera === null || camera === void 0 ? void 0 : camera.current.takePhoto(Object.assign(Object.assign({ skipMetadata: true }, takePhotoOptions), { flash: (isTorch && "on") || "off" })));
                snapshot.path = `file:///${snapshot.path}`;
                const newMedia = [snapshot, ...media];
                setMedia(newMedia);
                if (!multiSelect) {
                    setSelectedImage([snapshot]);
                }
                else {
                    setSelectedImage([...selectedImage, snapshot]);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    const startRecording = () => {
        try {
            if (!hasMicrophonePermission) {
                throw new Error("No Microphone Permission Found.");
            }
            setVideo(true);
            if (camera.current) {
                camera.current.startRecording(Object.assign(Object.assign({}, recordVideoOptions), { flash: (isTorch && "on") || "off", onRecordingFinished: (v) => {
                        const newMedia = [v, ...media];
                        setMedia(newMedia);
                        if (!multiSelect) {
                            setSelectedImage([v]);
                        }
                        else {
                            setSelectedImage([...selectedImage, v]);
                        }
                    }, onRecordingError: (error) => console.error(error) }));
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    const checkOut = () => {
        getData(selectedImage);
        setIsOpen(false);
    };
    const stopRecording = () => __awaiter(void 0, void 0, void 0, function* () {
        setVideo(false);
        if (camera.current && video) {
            yield camera.current.stopRecording();
        }
    });
    const onFocus = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            if ((!frontCamera && ((_a = devices === null || devices === void 0 ? void 0 : devices.back) === null || _a === void 0 ? void 0 : _a.supportsFocus)) ||
                (frontCamera && ((_b = devices === null || devices === void 0 ? void 0 : devices.front) === null || _b === void 0 ? void 0 : _b.supportsFocus))) {
                e.persist();
                const event = e.nativeEvent;
                let point = {
                    x: Math.round(event.pageX - 25),
                    y: Math.round(event.pageY - 25),
                };
                setFocused({ x: point.x - 25, y: point.y - 25 });
                yield ((_c = camera === null || camera === void 0 ? void 0 : camera.current) === null || _c === void 0 ? void 0 : _c.focus(point));
            }
        }
        catch (error) {
            console.log(e);
        }
        finally {
            setFocused(undefined);
        }
    });
    const onPressItem = (obj) => {
        if (multiSelect) {
            let selected = [...selectedImage];
            const index = selected.indexOf(obj);
            (index === -1 && selected.push(obj)) || selected.splice(index, 1);
            setSelectedImage(selected);
        }
        else {
            setSelectedImage([obj]);
        }
    };
    const onPressChangeCamera = () => {
        setIsFrontCamera(!frontCamera);
        setIsTorch(false);
    };
    if ((frontCamera && devices.front == null) ||
        (!frontCamera && devices.back == null) ||
        !hasCameraPermission) {
        return (<View style={centerStyle}>
        <ActivityIndicator size="large"/>
      </View>);
    }
    const identifyVideo = (obj) => (obj.duration && <Text style={isVideoStyle}>{"▶️"}</Text>) || null;
    const renderHeader = () => {
        return (<View style={flexDirection}>
        {(media.length &&
                media.map((obj, index) => {
                    const isSelected = selectedImage.includes(obj);
                    return (<Pressable style={styles.center} key={index} onPress={() => onPressItem(obj)}>
                <Image onError={(e) => console.log(e)} source={{ uri: `${obj.path}` }} style={[
                            imageStyle,
                            borderWidth,
                            {
                                borderColor: (isSelected && themeColor) || "transparent",
                            },
                        ]}/>
                {identifyVideo(obj)}
              </Pressable>);
                })) ||
                null}
      </View>);
    };
    const focusedView = () => focused && <View style={[focus, { top: focused.y, left: focused.x }]}/>;
    return (<>
      <Camera {...cameraProps} ref={camera} onError={(error) => console.log(error)} style={StyleSheet.absoluteFill} device={frontCamera ? devices.front : devices.back} onTouchEnd={(e) => { var _a; return ((_a = devices === null || devices === void 0 ? void 0 : devices.back) === null || _a === void 0 ? void 0 : _a.supportsFocus) && onFocus(e); }} isActive photo video focusable audio enableZoomGesture/>
      <Pressable style={closeButtonStyle} onPress={() => {
            setIsOpen(false);
        }}>
        <Text style={fontSize}>{"❌"}</Text>
      </Pressable>
      <View style={bottomOuter}>
        <FlatList showsHorizontalScrollIndicator={false} data={photos === null || photos === void 0 ? void 0 : photos.edges} horizontal ListHeaderComponent={renderHeader} renderItem={({ item }) => {
            const selectedImages = selectedImage;
            const index = selectedImages.indexOf(item);
            return (<Media index={index} item={item} onPressItem={onPressItem} themeColor={themeColor}/>);
        }} keyExtractor={(item) => item.node.image.uri} onEndReached={getMorePhotos}/>
        {(selectedImage.length && (<Pressable style={[checkButtonStyle, { backgroundColor: themeColor }]} onPress={checkOut}>
            <Text style={[{ color: secondaryColor }, styles.selectedLength]}>
              {selectedImage.length}
            </Text>
            <Text style={[{ color: secondaryColor }, styles.tick]}>{" ✓"}</Text>
          </Pressable>)) ||
            null}
        <View style={bottomInner}>
          <Pressable onPress={() => setIsTorch((prev) => !prev)} disabled={frontCamera} style={[
            flashStyle,
            { backgroundColor: (isTorch && white) || "transparent" },
        ]}>
            <Text style={[flashTextStyle, fontSize]}>{"⚡"}</Text>
          </Pressable>
          <Pressable onPress={takePicture} style={photoButton} onLongPress={startRecording} onPressOut={stopRecording}>
            <View style={(video && videoStyle) || {}}/>
          </Pressable>
          <Pressable onPress={onPressChangeCamera}>
            <Text style={fontSize}>{"🔄"}</Text>
          </Pressable>
        </View>
        <Text style={bottomText}>{"Hold for video, tap for photo"}</Text>
      </View>
      {focusedView()}
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
//# sourceMappingURL=AwesomeCamera.js.map