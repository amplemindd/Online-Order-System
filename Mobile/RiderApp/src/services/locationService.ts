import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';
import {apiRequest} from './api';

let watchId: number | null = null;
let isSendingLocation = false;
let lastSentAt = 0;

const LOCATION_UPDATE_INTERVAL = 5000;

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const permissions = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);

  return (
    permissions['android.permission.ACCESS_FINE_LOCATION'] ===
      PermissionsAndroid.RESULTS.GRANTED ||
    permissions['android.permission.ACCESS_COARSE_LOCATION'] ===
      PermissionsAndroid.RESULTS.GRANTED
  );
};

export const startLocationTracking = async (
  token: string,
  onError?: (message: string) => void,
): Promise<boolean> => {
  if (watchId !== null) {
    return true;
  }

  try {
    const permissionGranted = await requestLocationPermission();

    if (!permissionGranted) {
      onError?.('Location permission is required for live tracking.');
      return false;
    }

    lastSentAt = 0;
    isSendingLocation = false;

    watchId = Geolocation.watchPosition(
      async position => {
        const now = Date.now();

        if (
          isSendingLocation ||
          now - lastSentAt < LOCATION_UPDATE_INTERVAL
        ) {
          return;
        }

        isSendingLocation = true;
        lastSentAt = now;

        try {
          await apiRequest(
            '/rider/location',
            {
              method: 'POST',
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              }),
            },
            token,
          );
        } catch (error: any) {
          console.error('Location upload failed:', error.message);
        } finally {
          isSendingLocation = false;
        }
      },
      error => {
        console.error('GPS error:', error.message);
        onError?.(error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: LOCATION_UPDATE_INTERVAL,
        fastestInterval: 3000,
        timeout: 20000,
        maximumAge: 5000,
      },
    );

    return true;
  } catch (error: any) {
    onError?.(error.message || 'Unable to start location tracking.');
    return false;
  }
};

export const stopLocationTracking = (): void => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }

  isSendingLocation = false;
  lastSentAt = 0;
};