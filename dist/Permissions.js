var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Platform } from 'react-native';
import { check, RESULTS, request, PERMISSIONS, } from 'react-native-permissions';
export const isIOS = Platform.OS === 'ios';
export const checkForPermission = (permissionOf) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield check(permissionOf);
    switch (response) {
        case RESULTS.UNAVAILABLE:
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
        case RESULTS.BLOCKED:
            return response;
        case RESULTS.DENIED:
            return yield requestForPermission(permissionOf);
    }
});
export const requestForPermission = (permissionOf) => __awaiter(void 0, void 0, void 0, function* () { return yield request(permissionOf); });
export const getBooleanForPermission = (permissionStatus) => {
    if (!isIOS) {
        if (permissionStatus === RESULTS.GRANTED ||
            permissionStatus === RESULTS.LIMITED) {
            return true;
        }
    }
    else {
        if (permissionStatus === RESULTS.GRANTED) {
            return true;
        }
    }
    return false;
};
export const getStorageOrLibraryPermission = () => __awaiter(void 0, void 0, void 0, function* () {
    let permission;
    if (!isIOS) {
        permission = yield checkForPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    }
    else {
        permission = yield checkForPermission(PERMISSIONS.IOS.PHOTO_LIBRARY);
    }
    return getBooleanForPermission(permission);
});
export const getCameraPermission = () => __awaiter(void 0, void 0, void 0, function* () {
    let permission;
    if (!isIOS) {
        permission = yield checkForPermission(PERMISSIONS.ANDROID.CAMERA);
    }
    else {
        permission = yield checkForPermission(PERMISSIONS.IOS.CAMERA);
    }
    return getBooleanForPermission(permission);
});
export const getLocationPermission = () => __awaiter(void 0, void 0, void 0, function* () {
    let permission;
    if (!isIOS) {
        permission = yield checkForPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    else {
        permission = yield checkForPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    return getBooleanForPermission(permission);
});
//# sourceMappingURL=Permissions.js.map