# `📷 React Native Awesome Camera`

[![npm version](https://badge.fury.io/js/react-native-awesome-camera.svg)](https://badge.fury.io/js/react-native-awesome-camera) [![npm downloads](https://img.shields.io/npm/dm/react-native-awesome-camera.svg)](https://www.npmjs.com/package/react-native-camera)

## Features List

<hr>

- High-quality camera support in Android and iOS
- Select images and videos from phone storage with an option of multiple selection
- Capture images and videos using the awesome camera
- Flash, manual focus, and camera zoom features available
- Customize theme color

<br>
<p align="center">
  <img alt="Image Capture" src="https://iili.io/JxQ2dhl.jpg" width="45%">
&nbsp; &nbsp; &nbsp; &nbsp;
  <img alt="Video Capture" src="https://iili.io/JxQJtHb.jpg" width="45%">
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
yarn add react-native-permissions react-native-vision-camera @react-native-camera-roll/camera-roll react-native-gesture-handler
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
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO"/>
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  ....
</manifest>
```

### iOS Changes

<hr>

Add below lines in your **Podfile**

```podFile
# with react-native >= 0.72
- # Resolve react_native_pods.rb with node to allow for hoisting
- require Pod::Executable.execute_command('node', ['-p',
-   'require.resolve(
-     "react-native/scripts/react_native_pods.rb",
-     {paths: [process.argv[1]]},
-   )', __dir__]).strip

+ def node_require(script)
+   # Resolve script with node to allow for hoisting
+   require Pod::Executable.execute_command('node', ['-p',
+     "require.resolve(
+       '#{script}',
+       {paths: [process.argv[1]]},
+     )", __dir__]).strip
+ end

+ node_require('react-native/scripts/react_native_pods.rb')
+ node_require('react-native-permissions/scripts/setup.rb')
```

```
# with react-native < 0.72
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'
+ require_relative '../node_modules/react-native-permissions/scripts/setup'
```

```
# …

platform :ios, min_ios_version_supported
prepare_react_native_project!

# ⬇️ uncomment wanted permissions
setup_permissions([
  # 'AppTrackingTransparency',
  # 'BluetoothPeripheral',
  # 'Calendars',
  'Camera',
  # 'Contacts',
  # 'FaceID',
  # 'LocationAccuracy',
  # 'LocationAlways',
  # 'LocationWhenInUse',
  # 'MediaLibrary',
  'Microphone',
  # 'Motion',
  # 'Notifications',
  'PhotoLibrary',
  # 'PhotoLibraryAddOnly',
  # 'Reminders',
  # 'Siri',
  # 'SpeechRecognition',
  # 'StoreKit',
])

# …
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

if you are facing any permission-related issues, you can refer to [react-native-permissions/issues](https://github.com/zoontek/react-native-permissions/issues)

you can refer these links for fixing [React-bridging wrong paths](https://github.com/facebook/react-native/issues/34102), [Added correct namespace qualifier to .mm file](https://github.com/Shopify/react-native-skia/pull/629/files)

**Props:**

| Name                        | Type                  | Required | Description                                                                             | Default  |
| --------------------------- | --------------------- | -------- | --------------------------------------------------------------------------------------- | -------- |
| setIsOpen                   | Function              | Yes      | Close awesome camera screen                                                             | -        |
| getData                     | Function              | Yes      | Return selected or captured media                                                       | -        |
| multiSelect                 | boolean               | No       | Option to select multiple files (image or video)                                        | true     |
| themeColor                  | string                | No       | Custom theme color                                                                      | 'yellow' |
| secondaryColor              | string                | No       | Custom secondary color                                                                  | 'black'  |
| takePhotoOptions            | TakePhotoOptions      | No       | Extends react-native-vision-camera's TakePhotoOptions interface while capturing a photo | -        |
| recordVideoOptions          | RecordVideoOptions    | No       | Extends react-native-vision-camera's RecordVideoOptions interface when recording starts | -        |
| cameraProps                 | CameraProps           | No       | Extends react-native-vision-camera's CameraProps interface                              | -        |
| showGallery                 | boolean               | No       | For showing images available on device                                                  | true     |
| photo                       | boolean               | No       | For allowing photo capture                                                              | true     |
| video                       | boolean               | No       | For allowing video capture                                                              | true     |
| closeContainerStyle         | ViewStyle             | No       | For styling close icon container                                                        | -        |
| closeIconStyle              | ImageStyle            | No       | For styling close icon                                                                  | -        |
| closeIcon                   | ImageSourcePropType   | No       | For providing custom close image resource                                               | -        |
| renderCloseComponent        | ReactComponentElement | No       | For rendering custom close component                                                    | -        |
| videoContainerStyle         | ViewStyle             | No       | For styling video icon container                                                        | -        |
| videoIconStyle              | ImageStyle            | No       | For styling video icon                                                                  | -        |
| videoIcon                   | ImageSourcePropType   | No       | For providing custom video image resource                                               | -        |
| renderVideoComponent        | ReactComponentElement | No       | For rendering custom video component                                                    | -        |
| flashContainerStyle         | ViewStyle             | No       | For styling flash icon container                                                        | -        |
| flashIconStyle              | ImageStyle            | No       | For styling flash icon                                                                  | -        |
| flashIcon                   | ImageSourcePropType   | No       | For providing custom flash image resource                                               | -        |
| renderFlashComponent        | ReactComponentElement | No       | For rendering custom flash component                                                    | -        |
| changeCameraContainerStyle  | ViewStyle             | No       | For styling change camera icon container                                                | -        |
| changeCameraIconStyle       | ImageStyle            | No       | For styling change camera icon                                                          | -        |
| changeCameraIcon            | ImageSourcePropType   | No       | For providing custom change camera image resource                                       | -        |
| renderChangeCameraComponent | ReactComponentElement | No       | For rendering custom change camera component                                            | -        |

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

