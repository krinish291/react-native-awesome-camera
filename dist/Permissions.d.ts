import { AndroidPermission, IOSPermission, PermissionStatus } from 'react-native-permissions';
export declare const isIOS: boolean;
export declare const checkForPermission: (permissionOf: AndroidPermission | IOSPermission) => Promise<PermissionStatus>;
export declare const requestForPermission: (permissionOf: AndroidPermission | IOSPermission) => Promise<PermissionStatus>;
export declare const getBooleanForPermission: (permissionStatus: PermissionStatus) => boolean;
export declare const getStorageOrLibraryPermission: () => Promise<boolean>;
export declare const getMicrophonePermission: () => Promise<boolean>;
export declare const getCameraPermission: () => Promise<boolean>;
export declare const getLocationPermission: () => Promise<boolean>;
