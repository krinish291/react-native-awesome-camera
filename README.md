# `📷 React Native Awesome Camera`

[![npm version](https://badge.fury.io/js/react-native-awesome-camera.svg)](https://badge.fury.io/js/react-native-awesome-camera) [![npm downloads](https://img.shields.io/npm/dm/react-native-awesome-camera.svg)](https://www.npmjs.com/package/react-native-camera)

## Features List

<hr>

- High quality camera support in Android and iOS
- Select images and videos from phone storage with an option of mulitiple selection
- Capture images and videos using awesome camera
- Flash, manual focus and camera zoom features available
- Customize theme color

<br>
<p align="center">
  <img alt="Image Capture" src="https://iili.io/jrQlqv.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Video Capture" src="https://iili.io/jrQaLJ.jpg" width="45%">
</p>

<br>

### Installation and Setup steps

<hr>

```
yarn add react-native-awesome-camera
```

or

```
npm i react-native-awesome-camera
```

install dependencies

```
yarn add react-native-permissions
yarn add react-native-vision-camera
yarn add fbjs
yarn add git+https://github.com/BohdanSol/react-native-cameraroll.git
```

we are using **react-native-vision-camera**
<br><br>

### Android Changes

<hr>

Add below permission in your **AndroidManifest.xml**

```xml
<manifest>
  ....
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  ....
</manifest>
```

### iOS Changes

<hr>

Add below lines in your **Podfile**

```pod
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"
pod 'Permission-Microphone', :path => "#{permissions_path}/Microphone"
```

Also change your **Info.plist**

```xml
<dict>
....
  <key>NSCameraUsageDescription</key>
  <string>${APP_NAME} Need camera access to take pictures or video.</string>
  <key>NSMicrophoneUsageDescription</key>
  <string>${APP_NAME} Need microphone access to record audio.</string>
  <key>NSPhotoLibraryUsageDescription</key>
  <string>${APP_NAME} Need photo library access to access photo gallery.</string>
....
</dict>
```

if you are facing any permission related issues, you can refer [react-native-permissions/issues](https://github.com/zoontek/react-native-permissions/issues)

you may face some iOS issue because of new version of **react native 0.69**

you can refer this links for fixing [React-bridging wrong paths](https://github.com/facebook/react-native/issues/34102), [Added correct namespace qualifier to .mm file](https://github.com/Shopify/react-native-skia/pull/629/files)

**Props:**

| Name                | Type                | Required | Description                                                                              | Default   |
| ------------------- | ------------------- | -------- | ---------------------------------------------------------------------------------------- | --------- |
| setIsOpen           | Function            | Yes      | Close awesome camera screen                                                              | -         |
| getData             | Function            | Yes      | Return selected or captured media                                                        | -         |
| multiSelect         | boolean             | No       | Option to select multiple files (image or video)                                         | true      |
| themeColor          | string              | No       | Custom theme color                                                                       | 'yellow'  |
| secondaryColor      | string              | No       | Custom secondary color                                                                   | 'black'   |
| takePhotoOptions    | TakePhotoOptions    | No       | Extends react-native-vision-camera's TakePhotoOptions interface while capturing a photo  | -         |
| recordVideoOptions  | RecordVideoOptions  | No       | Extends react-native-vision-camera's RecordVideoOptions interface when recording starts  | -         |
| cameraProps         | CameraProps         | No       | Extends react-native-vision-camera's CameraProps interface                               | -         |

<br>

## Example

```javascript
import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet } from "react-native";
import AwesomeCamera from "react-native-awesome-camera";

const App = () => {
  const { container } = styles;
  const [isOpen, setIsOpen] = useState(false);

  const getData = (data: any) => {
    console.log({ data });
  };

  return (
    <SafeAreaView style={container}>
      {(!isOpen && (
        <Button
          title="button"
          onPress={() => {
            setIsOpen(true);
          }}
        />
      )) || <AwesomeCamera setIsOpen={setIsOpen} getData={getData} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
```

### Run Command Android

```
yarn install && npm run android
```

### Run Command iOS

```
yarn install && cd ios && pod install && cd ..  && npm run ios
```

## Welcome to issues!

- request for more features 🚀
- fork and fix open issues 🛠
- raise issue 📣

[open issues](https://github.com/krinish291/react-native-awesome-camera/issues)
