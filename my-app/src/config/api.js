import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Backend API Configuration
// Set your computer's local IP address here for testing on physical devices
// Find it using: ipconfig (Windows) or ifconfig (Mac/Linux)
const LOCAL_DEV_IP = '192.168.29.135'; // Your computer's local IP

const getApiUrl = () => {
  if (__DEV__) {
    // For web, use localhost
    if (Platform.OS === 'web') {
      return 'http://localhost:3000/api';
    }
    
    // For mobile, try to get the host from Expo's debugger
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    if (debuggerHost) {
      const host = debuggerHost.split(':')[0];
      console.log('[API] Using debugger host:', host);
      return `http://${host}:3000/api`;
    }
    
    // Fallback for Android emulator
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    }
    
    // Fallback for iOS physical devices - use your local network IP
    if (Platform.OS === 'ios') {
      console.log('[API] Using local dev IP for iOS:', LOCAL_DEV_IP);
      return `http://${LOCAL_DEV_IP}:3000/api`;
    }
    
    return 'http://localhost:3000/api';
  } else {
    return 'https://your-production-api.com/api';
  }
};

export const API_BASE_URL = getApiUrl();
export const MOBILE_API_URL = `${API_BASE_URL}/mobile`;

// Helper function to get full URL
export const getApiEndpoint = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export const getMobileApiEndpoint = (endpoint) => {
  return `${MOBILE_API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export default {
  API_BASE_URL,
  MOBILE_API_URL,
  getApiEndpoint,
  getMobileApiEndpoint,
};

