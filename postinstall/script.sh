yarn add @react-native-community/cameraroll
yarn add react-native-permissions
yarn add react-native-vision-camera
cp node_modules/react-native-awesome-camera/postinstall/CameraRollModule.java node_modules/@react-native-community/cameraroll/android/src/main/java/com/reactnativecommunity/cameraroll/CameraRollModule.java
echo "Postinstall react native awesome camera"