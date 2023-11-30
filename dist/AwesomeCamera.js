var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, FlatList, Text, Image, Platform, } from "react-native";
import { Camera, useCameraDevices, } from "react-native-vision-camera";
import { CameraRoll, } from "@react-native-camera-roll/camera-roll";
import { GestureHandlerRootView, PanGestureHandler, } from "react-native-gesture-handler";
import { getCameraPermission, getMicrophonePermission, getPhotoPermission, getStorageOrLibraryPermission, getVideoPermission, } from "./Permissions";
import { Media } from "./Media";
const white = "white";
const yellow = "yellow";
const black = "black";
const AwesomeCamera = (props) => {
    const { setIsOpen, getData, cameraProps, themeColor = yellow, secondaryColor = black, multiSelect = true, takePhotoOptions, recordVideoOptions, showGallery = true, photo = true, video = true, closeContainerStyle, closeIconStyle, closeIcon, renderCloseComponent, videoContainerStyle, videoIconStyle, videoIcon, renderVideoComponent, flashContainerStyle, flashIconStyle, flashIcon, renderFlashComponent, changeCameraContainerStyle, changeCameraIconStyle, changeCameraIcon, renderChangeCameraComponent, } = props;
    const { photoButton, bottomOuter, videoStyle, imageStyle, bottomInner, flashStyle, changeCamStyle, isVideoStyle, flexDirection, borderWidth, centerStyle, closeButtonStyle, focus, } = styles;
    const [isRecording, setIsRecording] = useState(false);
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
    const getIsPhotos = () => {
        let isPhoto = true;
        if (photo && video)
            isPhoto = true;
        else if (video)
            isPhoto = false;
        else if (photo)
            isPhoto = true;
        return isPhoto;
    };
    const [isPhotos, setIsPhotos] = useState(getIsPhotos());
    const devices = useCameraDevices();
    const camera = useRef(null);
    useEffect(() => {
        managePermissions();
    }, []);
    useEffect(() => {
        if (hasStoragePermission)
            getPhotosDetails();
    }, [hasStoragePermission]);
    const getPhotosDetails = () => __awaiter(void 0, void 0, void 0, function* () {
        if (showGallery) {
            const items = yield CameraRoll.getPhotos({
                first: 20,
                assetType: (photo && video && "All") || (video && "Videos") || "Photos",
            });
            setPhotos(items);
        }
    });
    const managePermissions = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (showGallery) {
                const isStoragePermission = yield getStorageOrLibraryPermission();
                let videoPermission = false;
                let photoPermission = false;
                if (Number(Platform.Version) >= 33) {
                    photoPermission = yield getPhotoPermission();
                    videoPermission = yield getVideoPermission();
                }
                setHasStoragePermission(isStoragePermission || (photoPermission && videoPermission));
            }
            if (video) {
                const isMicPermission = yield getMicrophonePermission();
                setHasMicrophonePermission(isMicPermission);
            }
            const isCameraPermission = yield getCameraPermission();
            setHasCameraPermission(isCameraPermission);
        }
        catch (error) {
            console.log(error);
        }
    });
    const getMorePhotos = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if ((photos === null || photos === void 0 ? void 0 : photos.page_info.has_next_page) && showGallery) {
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
            if (camera.current && photo) {
                const snapshot = yield (camera === null || camera === void 0 ? void 0 : camera.current.takePhoto(Object.assign(Object.assign({ skipMetadata: true }, takePhotoOptions), { flash: (isTorch && "on") || "off" })));
                snapshot.path = `file:///${snapshot.path}`;
                const newMedia = [snapshot, ...media];
                setMedia(newMedia);
                if (!multiSelect)
                    setSelectedImage([snapshot]);
                else
                    setSelectedImage([...selectedImage, snapshot]);
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    const startRecording = () => {
        try {
            if (!video)
                return;
            if (!hasMicrophonePermission)
                throw new Error("No Microphone Permission Found.");
            if (camera.current) {
                setIsRecording(true);
                camera.current.startRecording(Object.assign(Object.assign({}, recordVideoOptions), { flash: (isTorch && "on") || "off", onRecordingFinished: (v) => {
                        const newMedia = [v, ...media];
                        setMedia(newMedia);
                        if (!multiSelect)
                            setSelectedImage([v]);
                        else
                            setSelectedImage([...selectedImage, v]);
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
        setIsRecording(false);
        if (camera.current && isRecording)
            yield camera.current.stopRecording();
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
        else
            setSelectedImage([obj]);
    };
    const onPressChangeCamera = () => {
        setIsFrontCamera(!frontCamera);
        setIsTorch(false);
    };
    if ((frontCamera && devices.front == null) ||
        (!frontCamera && devices.back == null) ||
        !hasCameraPermission)
        return (<View style={centerStyle}>
        <ActivityIndicator size="large"/>
      </View>);
    const identifyVideo = (obj) => {
        if (obj.duration) {
            return (<>
          {(renderVideoComponent !== undefined && renderVideoComponent()) || (<View style={[
                        isVideoStyle,
                        { backgroundColor: "#ffffff90" },
                        videoContainerStyle,
                    ]}>
              <Image source={videoIcon !== null && videoIcon !== void 0 ? videoIcon : require("../Images/video.png")} style={[{ height: 20, width: 20 }, videoIconStyle]}/>
            </View>)}
        </>);
        }
        else {
            return null;
        }
    };
    const renderHeader = () => (<View style={flexDirection}>
      {(media.length &&
            media.map((obj, index) => {
                const isSelected = selectedImage.includes(obj);
                return (<Pressable style={styles.center} key={index} onPress={() => onPressItem(obj)}>
              <Image onError={(e) => console.log(e)} source={{ uri: `${obj.path}` }} style={[
                        imageStyle,
                        borderWidth,
                        { borderColor: (isSelected && themeColor) || "transparent" },
                    ]}/>
              {identifyVideo(obj)}
            </Pressable>);
            })) ||
            null}
    </View>);
    const focusedView = () => focused && <View style={[focus, { top: focused.y, left: focused.x }]}/>;
    const renderItem = ({ item }) => {
        const selectedImages = selectedImage;
        const index = selectedImages.indexOf(item);
        return (<Media index={index} item={item} onPressItem={onPressItem} themeColor={themeColor} renderVideoComponent={renderVideoComponent} videoContainerStyle={videoContainerStyle} videoIcon={videoIcon} videoIconStyle={videoIconStyle}/>);
    };
    const getBottomView = () => {
        return (<View style={{ flexDirection: "row", alignSelf: "center", marginTop: 5 }}>
        <Pressable onPress={() => setIsPhotos(false)} style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 15,
                backgroundColor: isPhotos ? "transparent" : themeColor,
            }}>
          <Text style={{ color: "black" }}>{"Video"}</Text>
        </Pressable>
        <Pressable onPress={() => setIsPhotos(true)} style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginLeft: 5,
                borderRadius: 15,
                backgroundColor: isPhotos ? themeColor : "transparent",
            }}>
          <Text style={{ color: "black" }}>{"Photo"}</Text>
        </Pressable>
      </View>);
    };
    return (<>
      {(hasCameraPermission && (<Camera {...cameraProps} ref={camera} onError={(error) => console.log(error)} style={StyleSheet.absoluteFill} device={frontCamera ? devices.front : devices.back} isActive photo={photo} video={video} focusable audio enableZoomGesture/>)) ||
            null}

      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <PanGestureHandler onGestureEvent={(e) => {
            if (isPhotos && e.nativeEvent.translationX > 0)
                setIsPhotos(false);
            else if (!isPhotos && e.nativeEvent.translationX < 0) {
                setIsPhotos(true);
            }
        }}>
          <Pressable style={StyleSheet.absoluteFill} onTouchEnd={(e) => { var _a; return ((_a = devices === null || devices === void 0 ? void 0 : devices.back) === null || _a === void 0 ? void 0 : _a.supportsFocus) && onFocus(e); }}/>
        </PanGestureHandler>
      </GestureHandlerRootView>

      <Pressable style={[closeButtonStyle, closeContainerStyle]} onPress={() => setIsOpen(false)}>
        {(renderCloseComponent !== undefined && renderCloseComponent()) || (<Image source={closeIcon !== null && closeIcon !== void 0 ? closeIcon : require("../Images/close.png")} style={[{ height: 20, width: 20 }, closeIconStyle]}/>)}
      </Pressable>

      <View style={bottomOuter}>
        <FlatList showsHorizontalScrollIndicator={false} data={photos === null || photos === void 0 ? void 0 : photos.edges} horizontal ListHeaderComponent={renderHeader} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} onEndReached={getMorePhotos}/>

        <CheckoutBtn selectedImage={selectedImage} themeColor={themeColor} onPressCheckout={checkOut} secondaryColor={secondaryColor}/>

        <View style={bottomInner}>
          <Pressable onPress={() => setIsTorch((prev) => !prev)} disabled={frontCamera} style={[
            flashStyle,
            { backgroundColor: (isTorch && white) || "transparent" },
            flashContainerStyle,
        ]}>
            {(renderFlashComponent !== undefined && renderFlashComponent()) || (<Image source={flashIcon !== null && flashIcon !== void 0 ? flashIcon : require("../Images/flash.png")} style={[{ height: 20, width: 20 }, flashIconStyle]}/>)}
          </Pressable>

          <Pressable onPress={() => {
            if (isPhotos) {
                takePicture();
            }
            else {
                if (isRecording) {
                    stopRecording();
                }
                else {
                    startRecording();
                }
            }
        }} style={photoButton}>
            <View style={isRecording && videoStyle}/>
          </Pressable>

          <Pressable style={[changeCamStyle, changeCameraContainerStyle]} onPress={onPressChangeCamera}>
            {(renderChangeCameraComponent !== undefined &&
            renderChangeCameraComponent()) || (<Image source={changeCameraIcon !== null && changeCameraIcon !== void 0 ? changeCameraIcon : require("../Images/swap.png")} style={[
                { height: 20, width: 20, tintColor: "white" },
                changeCameraIconStyle,
            ]}/>)}
          </Pressable>
        </View>

        <View>{(photo && video && getBottomView()) || null}</View>
      </View>

      {focusedView()}
    </>);
};
const CheckoutBtn = (props) => {
    const { selectedImage, themeColor, secondaryColor, onPressCheckout } = props;
    const { checkButtonStyle, selectedLength, tick } = styles;
    if (!selectedImage.length)
        return null;
    return (<Pressable style={[checkButtonStyle, { backgroundColor: themeColor }]} onPress={onPressCheckout}>
      <Text style={[{ color: secondaryColor }, selectedLength]}>
        {selectedImage.length}
      </Text>
      <Text style={[{ color: secondaryColor }, tick]}>{" ✓"}</Text>
    </Pressable>);
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